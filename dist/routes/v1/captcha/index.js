import { randomUUID } from 'crypto';
import { Router } from 'express';
import svgCaptcha from "svg-captcha";
import redis from '../../../config/redis.config.js';
const captchaRouter = Router();
captchaRouter.get('/', async (req, res) => {
    const captcha = svgCaptcha.create({
        size: 5,
        noise: 2,
        color: true,
        background: "#ccf2ff",
    });
    const captchaId = randomUUID();
    // Store captcha text in Redis with TTL = 2 min
    await redis.setex(`captcha:${captchaId}`, 120, captcha.text);
    res.json({
        captchaId,
        svg: captcha.data,
    });
});
export default captchaRouter;
//# sourceMappingURL=index.js.map