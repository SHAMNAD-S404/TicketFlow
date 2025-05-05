import dotenv from "dotenv";
import express, { Request as req, Response as res, NextFunction, ErrorRequestHandler } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import authRoutes from "./app/routes/authRoutes";
import cookieParser from "cookie-parser";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json()); //  to parse data
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// FOR HEALT CHECK
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

// Register routes
app.use("/", authRoutes);

export default app;
