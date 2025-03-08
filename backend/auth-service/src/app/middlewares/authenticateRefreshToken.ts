import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config";
import { HttpStatus } from "../../constants/httpStatus";
import { Messages } from "../../constants/messageConstants";

interface JwtPayload {
  authUserUUID: string;
  role: string;
  email: string;
  [key: string]: any;
}

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: Messages.TOKEN_NOT_FOUND, success: false });
        return;
    }

    const decode = jwt.verify(
      refreshToken,
      config.jwtRefreshSecret
    ) as JwtPayload;

    if (!decode.authUserUUID || !decode.email || !decode.role) {
      throw new Error("Invalid Token payload");
    }

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
    res
      .status(HttpStatus.UNAUTHORIZED)
      .json({ message: Messages.TOKEN_INVALID, success: false });
    return;
  }
};
