import dotenv from "dotenv";
import express, { Request as req,Response as res, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import { logger } from "./app/middlewares/logger";
import authRoutes from './app/routes/authRoutes'
import cookieParser from 'cookie-parser';

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debugging middleware
app.use((req, res, next) => {
  console.log("Incoming Request Path in Auth-Service:", req.path);
  console.log("Incoming Request Body in Auth-Service:", req.body);
  next();
});

// Register routes
app.use("/", authRoutes);




export default app;