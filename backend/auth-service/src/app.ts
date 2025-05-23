import dotenv from "dotenv";
import express from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import authRoutes from "./app/routes/authRoutes";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { logger } from "./utils/logger";

//custom Morgan stream using winston
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json()); // to parse data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//morgan setup
app.use(morgan("combined", { stream }));

// FOR HEALT CHECK
app.get("/health", (req, res) => {
  logger.info("Health check route accessed");
  res.status(200).send("OK");
});

// Register routes
app.use("/", authRoutes);

export default app;
