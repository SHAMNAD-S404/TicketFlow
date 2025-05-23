import { Request, Response, NextFunction } from "express";

export interface UserData {
  role: string;
  authUserUUID: string;
  email: string;
}

// middleware for access jwt data from custom header and assign them into req queries
export const extractUserData = (req: Request, res: Response, next: NextFunction) => {

  const userInfo = req.headers["x-user-data"];
  if (userInfo && typeof userInfo === "string") {
    const parsedUserInfo = JSON.parse(userInfo) as UserData;
    res.locals.userData = parsedUserInfo;

    // Add userId to query params
    if (!req.query.authUserUUID && parsedUserInfo.authUserUUID) {
      req.query.authUserUUID = parsedUserInfo.authUserUUID;
      req.query.email = parsedUserInfo.email;
      req.query.role = parsedUserInfo.role;
    }
  }

  next(); // forward to next middleward
};
