import { Request, Response, NextFunction } from 'express';
import express from 'express';

export const webhookMiddleware = express.raw({ type: 'application/json' });


export const rawBodyMiddleware = express.json({
  verify: (req: Request, res: Response, buffer: Buffer) => {
    if (req.originalUrl === '/api/payment/webhook') {
      (req as any).rawBody = buffer.toString();
    }
  }
});