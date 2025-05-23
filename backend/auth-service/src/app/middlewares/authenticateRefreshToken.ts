import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";
import { getRedisData } from "../../utils/redisUtils";

interface JwtPayload {
  authUserUUID: string;
  role: string;
  email: string;
  [key: string]: any;
}

// middleware for verifying the refresh token

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //extraction the token from the cookie
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.TOKEN_NOT_FOUND, success: false });
      return;
    }

    //checking for the refresh token is black listed or not
    const key = `blacklist:token:${refreshToken}`;
    const tokenStatus = await getRedisData(key);

    if (tokenStatus?.blacklisted) {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.TOKEN_INVALID, success: false });
      return;
    }

    //decoding user info
    const decode = jwt.verify(refreshToken, config.jwtRefreshSecret) as JwtPayload;
    // if token doesn't have required data
    if (!decode.authUserUUID || !decode.email || !decode.role) {
      throw new Error("Invalid Token payload");
    }
    // creating payload from jwt token
    const userInfo: JwtPayload = {
      authUserUUID: decode.authUserUUID,
      email: decode.email,
      role: decode.role,
    };

    //forward the data in custom header
    req.headers["x-user-data"] = JSON.stringify(userInfo);

    next();
  } catch (error) {
    console.error("refresh token verification failed", error);
    res.status(HttpStatus.UNAUTHORIZED).json({ message: Messages.TOKEN_INVALID, success: false });
    return;
  }
};
