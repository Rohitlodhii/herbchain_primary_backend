import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
interface FarmerJwtPayload extends jwt.JwtPayload {
    farmerId: string;
    mobileNumber: string;
}
declare module "express-serve-static-core" {
    interface Request {
        user?: FarmerJwtPayload;
    }
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=auth.d.ts.map