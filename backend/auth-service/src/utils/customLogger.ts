import { Request, Response, NextFunction } from "express";

export const customLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const body = Object.keys(req.body || {}).length ? JSON.stringify(req.body) : "{}";

    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - Status: ${
        res.statusCode
      } - Body: ${body} - ${duration}ms`
    );
  });

  next();
};
