import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET as string
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string
const ACCESS_TOKEN_EXPIRY = "30m"; // 30 minutes
const REFRESH_TOKEN_EXPIRY = "2d"; // 2 days

export const generateAccessToken = async (payload: object) : Promise<string> => {
    return jwt.sign(payload,ACCESS_TOKEN_SECRET,{expiresIn: ACCESS_TOKEN_EXPIRY});
}

export const generateRefreshToken = async (payload : object) : Promise<string> => {
    return jwt.sign(payload,REFRESH_TOKEN_SECRET,{expiresIn: REFRESH_TOKEN_EXPIRY});
}