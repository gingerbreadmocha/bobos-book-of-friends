import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import imageUploadRouter from "./routes/imageUpload.js";
import catsRouter from "./routes/cats.js";
import chatRouter from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN ?? "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins.length === 1 && allowedOrigins[0] === "*" ? "*" : allowedOrigins,
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    }),
);

app.use(express.json());

app.use("/api", authRouter);

app.use("/api", imageUploadRouter);

app.use("/api", catsRouter);

app.use("/api", chatRouter);

// Probe used by the client to tell when the server is ready; must be registered
// before the `/api` fallback so it doesn't get swallowed by the 404.
app.use("/api/heartbeat", (req, res) => {
    res.status(200).json({ message: "The cats have run over!" });
});

// Fallback for unhandled /api routes.
app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not found" });
})

// Central error handler: Express forwards thrown/rejected errors here.
app.use((err, req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Something went wrong." });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
