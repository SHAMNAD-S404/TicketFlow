import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/index";
import { Messages } from "../../constants/messageConstants";
import { HttpStatus } from "../../constants/httpStatus";

interface JwtPayload {
  authUserUUID: string;
  role: string;
  email: string;
  [key: string]: any;
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

    if (!token) {
      res.status(HttpStatus.FORBIDDEN).json({ message: Messages.TOKEN_INVALID });
      return;
    }

    const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;

    if (!decoded.authUserUUID || !decoded.email || !decoded.role) {
      throw new Error("Invalid Token payload");
    }

    const userInfo: JwtPayload = {
      authUserUUID: decoded.authUserUUID,
      role: decoded.role,
      email: decoded.email,
    };

    //Forward the user data in custom header
    req.headers["x-user-data"] = JSON.stringify(userInfo);

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(403).json({ message: Messages.TOKEN_INVALID, success: false });
    return;
  }
};
