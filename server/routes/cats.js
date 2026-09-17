import { Router } from "express";
import { prisma } from "../db/db.js";

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

export default router;
