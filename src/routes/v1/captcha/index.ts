import { randomUUID } from "crypto";
import { Router } from "express";
import svgCaptcha from "svg-captcha";
import { getRedisClient } from "../../../config/redis.config.js";

const captchaRouter = Router();

captchaRouter.get("/", async (req, res) => {
  try {
    const captcha = svgCaptcha.create({
      size: 5,
      noise: 2,
      color: true,
      background: "#ccf2ff",
    });

    const captchaId = randomUUID();

    // Get redis client
    const redis = await getRedisClient();

    // Store captcha text in Redis with TTL = 2 minutes
    await redis.set(`captcha:${captchaId}`, captcha.text, { EX: 120 });

    res.json({
      captchaId,
      svg: captcha.data,
    });
  } catch (err) {
    console.error("Captcha generation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default captchaRouter;
