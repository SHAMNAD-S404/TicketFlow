import { UserData } from "../interface/userTokenData";
import { Request, Response, NextFunction } from "express";

export const extractUserData = (req: Request, res: Response, next: NextFunction) => {
  const userInfo = req.headers["x-user-data"];
  if (userInfo && typeof userInfo === "string") {
    const parsedUserInfo = JSON.parse(userInfo) as UserData;
    res.locals.userData = parsedUserInfo;

    // Add userId to query params if it doesn't exist
    if (!req.query.authUserUUID && parsedUserInfo.authUserUUID) {
      req.query.authUserUUID = parsedUserInfo.authUserUUID;
      req.query.email = parsedUserInfo.email;
      req.query.role = parsedUserInfo.role;
    }
  }

  next();
};
