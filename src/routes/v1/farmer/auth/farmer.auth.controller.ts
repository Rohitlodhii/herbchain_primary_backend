import { Request, Response } from "express";
import client from "../../../../config/twilio.config.js";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../../../../lib/token.js";
import { getRedisClient } from "../../../../config/redis.config.js";


const db = new PrismaClient();

export const registerFarmer = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, captchaId, captchaInput } = req.body;

    // 🔹 Step 1: Basic checks
    if (!mobileNumber || !captchaId || !captchaInput) {
      return res.status(400).json({
        error: "Missing mobileNumber or captcha",
      });
    }

    // 🔹 Step 2: Verify captcha
    const redis = await getRedisClient();
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
    console.log(process.env.VERIFY_SERVICE_ID!);
    await client.verify.v2
      .services(process.env.VERIFY_SERVICE_ID!)
      .verifications.create({
        to: `+91${mobileNumber}`,
        channel: "sms",
      });

    return res.status(200).json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { mobileNumber, code } = req.body;

    if (!mobileNumber || !code) {
      return res.status(400).json({
        error: "Mobile Number and code are required",
      });
    }

    const verificationCheck = await client.verify.v2
      .services(process.env.VERIFY_SERVICE_ID!)
      .verificationChecks.create({
        to: `+91${mobileNumber}`,
        code,
      });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        error: "Invalid OTP",
      });
    }

    let farmer = await db.farmer.findUnique({ where: { mobileNumber } });
    if (!farmer)
      return res.status(404).json({
        error: "Farmer not found",
      });

    if (!farmer.farmerId) {
      const randomId = "FARM" + Math.floor(100000 + Math.random() * 900000);
      farmer = await db.farmer.update({
        where: { mobileNumber },
        data: { isOTPverified: true, farmerId: randomId },
      });
    } else {
      farmer = await db.farmer.update({
        where: { mobileNumber },
        data: {
          isVerified: true,
        },
      });
    }

    if (!farmer.farmerId) throw new Error("Farmer ID missing");
    const token = generateToken(farmer.farmerId, mobileNumber);

    return res.json({
      message: "OTP verified successfully",
      farmerId: farmer.farmerId,
      authToken: token,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: "OTP verification failed" });
  }
};
