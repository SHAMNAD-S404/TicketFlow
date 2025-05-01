import dotenv from "dotenv";
import express, { Request as req, Response as res, NextFunction, ErrorRequestHandler } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import { logger, requestContext } from "./utils/logger";
import morganMiddleware from "./app/middlewares/morgan";
import authRoutes from "./app/routes/authRoutes";
import cookieParser from "cookie-parser";
import { HttpStatus } from "./constants/httpStatus";
import { Messages } from "./constants/messageConstants";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(requestContext());   //req id middleware
app.use(morganMiddleware);  // morgan for logging
app.use(express.json());   //  to parse data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// logger setup
app.use((req: any, res, next) => {
  logger.info("Incoming req", {
    path: req.path,
    body: req.body,
    requestId: req.id,
  });
  next();
});

// Register routes
app.use("/", authRoutes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  logger.error("Unhandled Error", {
    error: err.message,
    stack: err.stack,
    requestId: (req as any).id,
  });
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.SERVER_ERROR });
};

// Register error handler
app.use(errorHandler);

export default app;
