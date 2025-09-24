import dotenv from "dotenv";
dotenv.config();
import jwt from 'jsonwebtoken';
export const generateToken = (farmerId, mobileNumber) => {
    const token = jwt.sign({ farmerId, mobileNumber }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
    return token;
};
//# sourceMappingURL=token.js.map