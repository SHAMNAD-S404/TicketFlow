import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { config } from "./config/index";
import { logger } from "./middleware/logger";
import { validateEnvVariables } from "./util/validateEnv";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import morgan from "morgan";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(cookieParser());

app.use(logger);
app.use(morgan("dev"));

// Set up CORS
app.use(
  cors({
    origin: config.frontend_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/auth", proxy(config.authServiceUrl));
app.use(
  "/company",
  authenticateToken,
  proxy(config.companyServiceUrl, {
    parseReqBody: false,
  })
);
app.use(
  "/tickets",
  authenticateToken,
  proxy(config.ticketServiceUrl, {
    parseReqBody: false,
  })
);

app.use("/communication", authenticateToken, proxy(config.communicationServiceUrl));

export default app;
