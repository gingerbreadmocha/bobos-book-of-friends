import 'dotenv/config';
import express from "express";
import cors from "cors"
import { ImageKit } from '@imagekit/nodejs';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = (process.env.CORS_ORIGIN ?? "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: allowedOrigins.length === 1 && allowedOrigins[0] === "*"
        ? "*"
        : allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
}));

app.use(express.json());


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

app.get("/api/imagekit/auth", (req, res) => {
    ('imagekit auth being called');
    const { token, expire, signature } = imageKit.helper.getAuthenticationParameters();

    res.json({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
})
