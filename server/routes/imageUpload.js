import { Router } from "express";
import { ImageKit } from '@imagekit/nodejs';

const router = Router();


const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

/**
 * GET /api/imagekit/auth
 * 
 */
router.get("/imagekit/auth", (req, res) => {
    const { token, expire, signature } = imageKit.helper.getAuthenticationParameters();

    res.json({
        token,
        expire,
        signature,
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    })
})

export default router;

