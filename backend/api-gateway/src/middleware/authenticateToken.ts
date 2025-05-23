import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/index";
import { getRedisData } from "../util/redisUtils";
import { HttpStatus } from "../const/httpStatus";
import { Messages } from "../const/messages";

// interface for jwt payload
interface JwtPayload {
  userId?: string;
  role?: string;
  email?: string;
  [key: string]: any;
}

// middleware for authenticate jwt token
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    //getting token
    const token = req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(HttpStatus.FORBIDDEN).json({ message: Messages.TOKEN_NOT_FOUND });
      return;
    }
    //decode jwt token
    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
    //extracting user data
    const userInfo = {
      authUserUUID: decoded.authUserUUID,
      role: decoded.role,
      email: decoded.email,
    };

    //check if user is blacklisted in Reddis
    const key = `blacklist:user:${userInfo.email}`;
    const isBlacklisted = await getRedisData(key);

    if (isBlacklisted) {
      //Clear cookies to prevent further automatic login
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.USER_BLOCKED, success: false });
      return;
    }

    //Forward the user data in custom header
    req.headers["x-user-data"] = JSON.stringify(userInfo);

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
