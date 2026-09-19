import { Router } from "express";
import { prisma } from "../db/db.js";
import { getAuthenticatedUserId } from "../utils/auth.js";

const DEFAULT_PER_PAGE = 16;

const NAME_MAX_LENGTH = 100; // matches Cat.name @db.VarChar(100)
const DESCRIPTION_MAX_LENGTH = 1000;
const AVATAR_URL_MAX_LENGTH = 2048;

const PERSONALITY_QUIZ_QUESTIONS = [
    {
        id: "energy",
        prompt: "How would you describe their energy?",
        options: ["Chill & relaxed", "Balanced", "Energetic & playful"],
    },
    {
        id: "affection",
        prompt: "How affectionate are they?",
        options: ["Always wants cuddles", "Affectionate on their terms", "Pretty independent", "I am their servant"],
    },
    {
        id: "vocal",
        prompt: "How vocal are they?",
        options: ["Almost silent", "Occasional meows", "Pretty chatty", "Has an opinion about EVERYTHING"],
    },
    {
        id: "strangers",
        prompt: "How do they react to strangers?",
        options: ["Hides immediately", "Watches from a safe distance", "Slowly warms up", "Immediately says hello"],
    },
    {
        id: "cats",
        prompt: "How do they feel about other cats?",
        options: ["Prefers being alone", "Doesn't really care", "Likes having a friend", "Loves everyone"],
    },
    {
        id: "favoriteActivity",
        prompt: "What's their favorite activity?",
        options: ["Sleeping", "Playing", "Eating", "Watching the world", "Getting attention"],
    },
    {
        id: "whenWantingSomething",
        prompt: "What do they do when they want something?",
        options: ["Stare at me", "Meow", "Follow me around", "Demand it loudly", "Find a way to get it themselves"],
    },
    {
        id: "vibe",
        prompt: "Which best describes your cat?",
        options: ["Sweet & gentle", "Sassy & opinionated", "Silly & Chaotic", "Confident & bossy", "Shy & sensitive"],
    },
];

function validateCatInput(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { error: "Invalid request body.", cat: null };
    }

    const normalized = {
        name: typeof body.name === "string" ? body.name.trim() : "",
        avatarUrl: typeof body.avatarUrl === "string" ? body.avatarUrl.trim() : null,
        description: typeof body.description === "string" ? body.description.trim() : null,
        personality: body.personality,
    };

    if (!normalized.name) {
        return { error: "Name is required.", cat: null };
    }
    if (normalized.name.length > NAME_MAX_LENGTH) {
        return { error: `Name must be ${NAME_MAX_LENGTH} characters or fewer.`, cat: null };
    }

    if (normalized.avatarUrl && normalized.avatarUrl.length > AVATAR_URL_MAX_LENGTH) {
        return { error: `Avatar URL must be ${AVATAR_URL_MAX_LENGTH} characters or fewer.`, cat: null };
    }

    if (normalized.description && normalized.description.length > DESCRIPTION_MAX_LENGTH) {
        return { error: `Description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer.`, cat: null };
    }

    const personality = normalized.personality;
    if (!personality || typeof personality !== "object" || Array.isArray(personality)) {
        return { error: "Answer the personality quiz to create your cat.", cat: null };
    }

    for (const question of PERSONALITY_QUIZ_QUESTIONS) {
        const answer = personality[question.id];
        if (typeof answer !== "string" || !answer.trim()) {
            return { error: `Please answer: ${question.prompt}`, cat: null };
        }
        if (!question.options.includes(answer)) {
            return { error: `Invalid answer for: ${question.prompt}`, cat: null };
        }
    }

    // Trim empty avatar URL to null so we never persist an empty string.
    return { error: null, cat: { ...normalized, avatarUrl: normalized.avatarUrl || null } };
}

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
 * Body: { name, avatarUrl?, description?, personality }
 * Creates a cat that belongs to the signed-in user.
 */
router.post("/cats", async (req, res) => {
    const ownerId = getAuthenticatedUserId(req);
    if (!ownerId) {
        return res.status(401).json({ error: "Sign in to create a cat." });
    }

    const { error, cat } = validateCatInput(req.body ?? {});
    if (error) {
        return res.status(400).json({ error });
    }

    try {
        const created = await prisma.cat.create({
            data: {
                name: cat.name,
                avatarUrl: cat.avatarUrl,
                description: cat.description,
                personality: cat.personality,
                ownerId,
            },
            include: { owner: { select: { id: true, username: true } } },
        });

        res.status(201).json(created);
    } catch (err) {
        console.log("err ", err);
        return res.status(500).json({ error: "Failed to create cat." });
    }
});

export default router;
