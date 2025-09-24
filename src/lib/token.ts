
import dotenv from "dotenv";
dotenv.config(); 
import jwt from 'jsonwebtoken'


export const generateToken = ( farmerId : string , mobileNumber : number ) : string => {
    const token = jwt.sign(
      {  farmerId , mobileNumber } ,
      process.env.JWT_SECRET as string ,
      {
        expiresIn : '1h'
      }
    );

    return token;
}