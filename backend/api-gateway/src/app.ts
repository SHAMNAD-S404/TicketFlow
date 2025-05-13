import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import { createProxyMiddleware } from "http-proxy-middleware";
import { config } from "./config/index";
import { logger } from "./middleware/logger";
import { validateEnvVariables } from "./util/validateEnv";
import cookieParser from "cookie-parser";
import { authenticateToken } from "./middleware/authenticateToken";
import morgan from "morgan";
import http from "http";
import rateLimit from "express-rate-limit";
import { Messages } from "./const/messages";

dotenv.config();
validateEnvVariables();

const app = express();

// for health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(cookieParser());

// RATE LIMITTING
app.set("trust proxy",1);

const apiLimiter = rateLimit({
  windowMs : 5 * 60 * 1000, //5MIN
  max : 300,
  message : {
    status : 429,
    message : Messages.IP_LIMIT_EXCEED
  },
  standardHeaders : true, //return the rate limmit info in headers
  legacyHeaders : false, // disable the "x-rate limit headers"
});

//use rate limiting middleware
app.use(apiLimiter);


app.use(logger);
app.use(morgan("dev"));

// Set up CORS
app.use(
  cors({
    origin: ["https://ticketflow.shamnad.site", config.frontend_URL, config.frontend_production_url],
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

// AUTH SERVICE
app.use("/auth", proxy(config.authServiceUrl));

// COMPANY SERVICE
app.use("/company",authenticateToken,proxy(config.companyServiceUrl, {parseReqBody: false}));

// TICKET SERVICE
app.use("/tickets",authenticateToken, proxy(config.ticketServiceUrl, { parseReqBody: false}));

// COMMUNICATION SERVICE
app.use("/communication", authenticateToken, proxy(config.communicationServiceUrl));

// SUBSCRIPTION SERVICE
app.use( "/subscription",proxy(config.subscription_service,{ parseReqBody: false}));

 
  

export { app, server };
