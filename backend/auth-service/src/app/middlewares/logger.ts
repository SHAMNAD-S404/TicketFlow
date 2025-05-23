import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`Request recieved - Method: ${req.method}, Path: ${req.path}`);
  next();
};
