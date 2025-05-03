import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "./config/index";
import { validateEnvVariables } from "./util/validateEnv";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import morgan from "morgan";
import http from "http";
import morganMiddleware from "./middleware/morgan";
import { logger,requestContext } from "./util/logger";


dotenv.config();
validateEnvVariables();

const app = express();

app.use(cookieParser());


app.use(morgan("dev"));

// Set up CORS
app.use(
  cors({
    origin: config.frontend_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//  HTTP server from Express app
const server = http.createServer(app);

//  Socket.IO proxy for the communication service
const socketProxy = createProxyMiddleware({
  target: config.communicationServiceUrl,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  pathRewrite: { "^/socket.io": "/socket.io" },
});

//  proxy middleware
app.use("/socket.io", socketProxy);

// Standard REST API routes using express-http-proxy
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

//subscription service
app.use(
  "/subscription",
  proxy(config.subscription_service, {
    parseReqBody: false,
  })
);

export { app, server };
