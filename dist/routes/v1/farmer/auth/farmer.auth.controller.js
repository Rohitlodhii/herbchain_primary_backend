// import db from "../../../../database/prisma.database.js";
import client from "../../../../config/twilio.config.js";
import { PrismaClient } from "@prisma/client";
import redis from "../../../../config/redis.config.js";
import { generateToken } from "../../../../lib/token.js";
import { error } from "console";
const db = new PrismaClient();
export const registerFarmer = async (req, res) => {
    try {
        const { mobileNumber, captchaId, captchaInput } = req.body;
        // 🔹 Step 1: Basic checks
        if (!mobileNumber || !captchaId || !captchaInput) {
            return res.status(400).json({
                error: "Missing mobileNumber or captcha",
            });
        }
        // 🔹 Step 2: Verify captcha
        const storedCaptcha = await redis.get(`captcha:${captchaId}`);
        if (!storedCaptcha) {
            return res.status(400).json({ error: "Captcha expired" });
        }
        if (storedCaptcha.toLowerCase() !== captchaInput.toLowerCase()) {
            return res.status(400).json({ error: "Invalid captcha" });
        }
        // Prevent reuse
        await redis.del(`captcha:${captchaId}`);
        // 🔹 Step 3: Farmer lookup / create
        let farmer = await db.farmer.findUnique({
            where: { mobileNumber },
        });
        if (!farmer) {
            farmer = await db.farmer.create({
                data: { mobileNumber, isVerified: false },
            });
        }
        // 🔹 Step 4: Send OTP with Twilio
        console.log(process.env.VERIFY_SERVICE_ID);
        await client.verify.v2
            .services(process.env.VERIFY_SERVICE_ID)
            .verifications.create({
            to: `+91${mobileNumber}`,
            channel: "sms",
        });
        return res.status(200).json({
            message: "OTP sent successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to send OTP" });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { mobileNumber, code } = req.body;
        console.log(mobileNumber);
        console.log(code);
        if (!mobileNumber || !code) {
            return res.status(400).json({
                error: "Mobile Number and code are required"
            });
        }
        const verificationCheck = await client.verify.v2
            .services(process.env.VERIFY_SERVICE_ID)
            .verificationChecks.create({
            to: `+91${mobileNumber}`,
            code,
        });
        if (verificationCheck.status !== "approved") {
            return res.status(400).json({
                error: "Invalid OTP"
            });
        }
        let farmer = await db.farmer.findUnique({ where: { mobileNumber } });
        if (!farmer)
            return res.status(404).json({
                error: "Farmer not found"
            });
        if (!farmer.farmerId) {
            const randomId = "FARM" + Math.floor(100000 + Math.random() * 900000);
            farmer = await db.farmer.update({
                where: { mobileNumber },
                data: { isOTPverified: true, farmerId: randomId }
            });
        }
        else {
            farmer = await db.farmer.update({
                where: { mobileNumber },
                data: {
                    isVerified: true
                }
            });
        }
        if (!farmer.farmerId)
            throw error;
        const token = generateToken(farmer.farmerId, mobileNumber);
        return res.json({
            message: "OTP verified successfully",
            farmerId: farmer.farmerId,
            authToken: token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "OTP verification failed" });
    }
};
//# sourceMappingURL=farmer.auth.controller.js.map