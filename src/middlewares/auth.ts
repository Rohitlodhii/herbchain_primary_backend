import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

dotenv.config();


interface FarmerJwtPayload extends jwt.JwtPayload {
    farmerId: string;
    mobileNumber: string;
  }
  declare module "express-serve-static-core" {
    interface Request {
      user?: FarmerJwtPayload;
    }
  }
  
  export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
  
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }
  
    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid token" });
      }
  
      req.user = decoded as FarmerJwtPayload; // ✅ cast to custom payload
      next();
    });
  };
  
