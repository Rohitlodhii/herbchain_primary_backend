import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../../../../database/prisma.database.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // store securely

// User Login Controller
export const loginLabUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await db.labUser.findUnique({
      where: { email },
      include: { lab: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const labId = user.labId;
    
    const isLabVerified = await db.lab.findUnique({
        where : { id : labId},        
    })
   
    if (!isLabVerified?.isVerified) {
        return res.json({
          message: "Lab not verified",
          token: null,
        });
      }
      


    let isAdmin = false;
    if( user.role === "ADMIN" ){
        isAdmin = true;
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user.id,
        labId: user.labId,
        isAdmin
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin ,
        lab: { id: user.lab.id, name: user.lab.name },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
