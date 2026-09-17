import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/** Returns the signed-in user's id from the `Authorization: Bearer <token>` header, or null. */
export function getAuthenticatedUserId(req) {
    const authHeader = req.headers.authorization ?? "";
    if (!authHeader.startsWith("Bearer ")) {
        return null;
    }

    try {
        const payload = jwt.verify(authHeader.slice("Bearer ".length).trim(), JWT_SECRET);
        return typeof payload.sub === "string" ? payload.sub : null;
    } catch {
        // Missing, invalid, or expired token.
        return null;
    }
}
