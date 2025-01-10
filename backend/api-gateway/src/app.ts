import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "./config/index";
import { logger } from "./middleware/logger";
import { validateEnvVariables } from "./util/validateEnv";

dotenv.config();
validateEnvVariables();

const app = express();

// Set up body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log requests
app.use(logger);

// Set up CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

// Proxy paths
app.use("/auth", createProxyMiddleware({ target: config.authServiceUrl, changeOrigin: true }));
app.use("/company", createProxyMiddleware({ target: config.companyServiceUrl, changeOrigin: true }));

export default app;
