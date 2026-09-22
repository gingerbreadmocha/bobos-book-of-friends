import { Router } from "express";
import { prisma } from "../db/db.js";
import { getAuthenticatedUserId } from "../utils/auth.js";
import { generateCatReply } from "../services/cats/catLlm.js";

const router = Router();

/**
 * GET /api/chat/history/:catId
 * Returns the signed-in user's saved chat history with a cat (oldest first).
 */
router.get("/chat/history/:catId", async (req, res) => {
    const userId = getAuthenticatedUserId(req);
    if (!userId) {
        return res.status(401).json({ error: "Sign in to view chat history." });
    }

    const { catId } = req.params;

    try {
        const history = await prisma.chatMessage.findMany({
            where: { catId, userId },
            orderBy: { createdAt: "asc" },
            take: 100,
            select: { id: true, role: true, content: true, createdAt: true },
        });

        res.json({
            messages: history.map((message) => ({
                id: message.id,
                role: message.role === "assistant" ? "cat" : "user",
                text: message.content,
                createdAt: message.createdAt,
            })),
        });
    } catch (err) {
        console.error("Chat history request failed:", err);
        return res.status(500).json({ error: "Failed to load chat history." });
    }
});

/**
 * POST /api/chat
 * Body: { catId: string, message: string }
 * Returns the cat's reply.
 */
router.post("/chat", async (req, res) => {
    // Guests chat anonymously; conversations are only persisted for signed-in users.
    const userId = getAuthenticatedUserId(req);

    const { catId, message } = req.body;

    if (!catId || !message) {
        return res.status(400).json({ error: "catId and message are required." });
    }

    try {
        const reply = await generateCatReply({ catId, userId, message });

        if (reply === null) {
            return res.status(404).json({ error: "Cat not found." });
        }

        const cat = await prisma.cat.findUnique({
            where: { id: catId },
            select: { id: true, name: true },
        });

        if (!cat) {
            return res.status(404).json({ error: "Cat not found." });
        }

        res.json({ cat, reply });
    } catch (err) {
        console.error("Chat request failed:", err);
        return res.status(500).json({ error: "Failed to get a reply from the cat." });
    }
});

export default router;
