import { Router } from "express";
import { prisma } from "../db/db.js";
import { getAuthenticatedUserId } from "../utils/auth.js";

const DEFAULT_PER_PAGE = 16;

const router = Router();

/**
 * GET /api/cats
 * Query: { page?: number, perPage?: number }
 * Returns cats paginated by 15 per page (newest first) with pagination
 * metadata so clients can render page controls.
 */
router.get("/cats", async (req, res) => {
    const page = req.query.page || 1;
    if (page === null || page < 1) {
        return res.status(400).json({ error: "page must be a positive integer." });
    }

    const [cats, total] = await Promise.all([
        prisma.cat.findMany({
            skip: (page - 1) * DEFAULT_PER_PAGE,
            take: DEFAULT_PER_PAGE,
            orderBy: { createdAt: "desc" },
            include: { owner: { select: { id: true, username: true } } },
        }),
        prisma.cat.count(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / DEFAULT_PER_PAGE));

    res.json({
        cats,
        pagination: {
            page,
            total,
            totalPages,
            hasNext: page < totalPages,
        },
    });
});

/**
 * GET /api/cats/chatted
 * Returns the cats the signed-in user has chatted with, along with the most
 * recent message in each conversation (newest conversation first).
 */
router.get("/cats/chatted", async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
        return res.status(401).json({ error: "Sign in to view your chats." });
    }

    const cats = await prisma.cat.findMany({
        where: { messages: { some: { userId } } },
        include: {
            owner: { select: { id: true, username: true } },
            messages: {
                where: { userId },
                orderBy: { createdAt: "desc" },
                take: 1,
                select: { id: true, role: true, content: true, createdAt: true },
            },
        },
    });

    res.json({
        cats: cats
            .map(({ messages, ...cat }) => ({
                ...cat,
                lastMessage: {
                    id: messages[0].id,
                    role: messages[0].role === "assistant" ? "cat" : "user",
                    text: messages[0].content,
                    createdAt: messages[0].createdAt,
                },
            }))
            .sort(
                (a, b) =>
                    b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime(),
            ),
    });
});

/**
 * GET /api/cats/:id
 * Returns a single cat (with its owner) so pages reached by direct URL
 * (e.g. /cat/:id) can load the cat without walking the paginated list.
 */
router.get("/cats/:id", async (req, res) => {
    const cat = await prisma.cat.findUnique({
        where: { id: req.params.id },
        include: { owner: { select: { id: true, username: true } } },
    });

    if (!cat) {
        return res.status(404).json({ error: "Cat not found." });
    }

    res.json(cat);
});

/**
 * GET /api/my-cats
 * Returns the cats owned by the signed-in user (newest first).
 */
router.get("/my-cats", async (req, res) => {
    const ownerId = getAuthenticatedUserId(req);
    if (!ownerId) {
        return res.status(401).json({ error: "Sign in to view your cats." });
    }

    const cats = await prisma.cat.findMany({
        where: { ownerId },
        orderBy: { createdAt: "desc" },
        include: { owner: { select: { id: true, username: true } } },
    });

    res.json({ cats });
});

/**
 * POST /api/cats
 */
router.post("/cats", async (req, res) => {
    const ownerId = getAuthenticatedUserId(req);
    if (!ownerId) {
        return res.status(401).json({ error: "Sign in to create a cat." });
    }

    // TODO: ADD Validations

    try {
        let cat;
        cat = await prisma.cat.create({
            data: {
                name: req.body.name,
                avatarUrl: req.body.avatarUrl || null,
                description: req.body.description || null,
                personality: req.body.personality,
                ownerId: ownerId,
            },
            include: { owner: { select: { id: true, username: true } } },
        });

        res.status(201).json(cat);
    } catch (err) {
        console.log("err ", err);
        return res.status(500).json({ error: "Failed to create cat." });
    }
});

export default router;
