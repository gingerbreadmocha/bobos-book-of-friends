import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../db/db.js";

const BCRYPT_ROUNDS = 10;
const JWT_EXPIRES_IN = "7d";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be set in .env");
}

const router = Router();

/** Strips sensitive fields before sending a user to the client. */
function toPublicUser(user) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
    };
}

function signToken(userId) {
    return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function normalizeEmail(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/**
 * POST /api/create-account
 * Body: { username, email, password }
 * Creates a new account, then signs it in by returning a token.
 */
router.post("/create-account", async (req, res) => {
    const body = req.body ?? {};
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = normalizeEmail(body.email);
    const password = typeof body.password === "string" ? body.password : "";

    if (!username) {
        return res.status(400).json({ error: "Username is required." });
    }
    if (username.length > 20) {
        return res.status(400).json({ error: "Username must be 20 characters or fewer." });
    }
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!password) {
        return res.status(400).json({ error: "Password is required." });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters." });
    }

    const [existingEmail, existingUsername] = await Promise.all([
        prisma.user.findUnique({ where: { email } }),
        prisma.user.findFirst({ where: { username } }),
    ]);

    if (existingEmail) {
        return res.status(409).json({ error: "An account with that email already exists." });
    }
    if (existingUsername) {
        return res.status(409).json({ error: "That username is already taken." });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    let user;
    try {
        user = await prisma.user.create({
            data: { username, email, passwordHash },
        });
    } catch (err) {
        if (err?.code === "P2002") {
            return res.status(409).json({ error: "That email is already in use." });
        }
        throw err;
    }

    res.status(201).json({ token: signToken(user.id), user: toPublicUser(user) });
});

/**
 * POST /api/login
 * Body: { email, password } or { username, password }
 * Verifies credentials and returns a token.
 */
router.post("/login", async (req, res) => {
    const body = req.body ?? {};
    const email = normalizeEmail(body.email);
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!password || (!email && !username)) {
        return res.status(400).json({
            error: "Provide an email (or username) and a password.",
        });
    }

    const user = email
        ? await prisma.user.findUnique({ where: { email } })
        : await prisma.user.findFirst({ where: { username } });

    if (!user) {
        return res.status(401).json({ error: "Invalid email/username or password." });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
        return res.status(401).json({ error: "Invalid email/username or password." });
    }

    res.json({ token: signToken(user.id), user: toPublicUser(user) });
});

export default router;
