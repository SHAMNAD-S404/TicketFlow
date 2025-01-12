import { Request, Response, NextFunction } from "express";

export const logger = (req: Request, res: Response, next: NextFunction) => {
    console.log('koiiiiiiiiiii');
    
  console.log(req.body)
  console.log(`Request recieved - Method: ${req.method}, Path: ${req.path}`);
  next();
};
