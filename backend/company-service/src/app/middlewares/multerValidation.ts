import { Request, Express } from "express";
import { FileFilterCallback } from "multer";

const allowedMimeTypes: string[] = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

export const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and GIF files are allowed") as any, false);
  }
};
