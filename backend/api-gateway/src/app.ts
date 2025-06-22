import dotenv from "dotenv";
import express,{Request,Response} from "express";
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
import { HttpStatus } from "./const/httpStatus";

dotenv.config();
validateEnvVariables();

const app = express();

//========================= HEALTH CHECK ENDPOINT ===========================================

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

//========================= FOR COOKIE PARSIN ===============================================

app.use(cookieParser());

//========================= RATE LIMITTING SETUP =============================================

app.set("trust proxy", 1);

const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, //5MIN
  max: 300,
  message: {
    status: 429,
    message: Messages.IP_LIMIT_EXCEED,
  },
  standardHeaders: true, //return the rate limmit info in headers
  legacyHeaders: false, // disable the "x-rate limit headers"
});

//use rate limiting middleware
app.use(apiLimiter);

//========================= LOGGING SETUP CONFIGS =============================================

app.use(logger);
app.use(morgan("dev"));

//========================= CORS CONFIGURATIONS ===============================================

// Configure CORS Policy
app.use(
  cors({
    origin: [
      "https://ticketflow.shamnad.site",
      config.frontend_URL,
      config.frontend_production_url,
      config.FRONTEND_PRODUCTION_URL2
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//========================= CREAT HTTP SERVER USING EXPESS APP =====================================

const server = http.createServer(app);

//========================= SOCKET PROXY CONFIGURATIONS ============================================

// Socket.IO proxy for the communication service
const socketProxy = createProxyMiddleware({
  target: config.communicationServiceUrl,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  pathRewrite: { "^/socket.io": "/socket.io" },
});

//========================= ROUTE MAPPING FOR SERVICES =============================================

//  proxy middleware
app.use("/socket.io", socketProxy);

// AUTH SERVICE
app.use("/auth", proxy(config.authServiceUrl));

// COMPANY SERVICE
app.use("/company", authenticateToken, proxy(config.companyServiceUrl, { parseReqBody: false }));

// TICKET SERVICE
app.use("/tickets", authenticateToken, proxy(config.ticketServiceUrl, { parseReqBody: false }));

// COMMUNICATION SERVICE
app.use("/communication", authenticateToken, proxy(config.communicationServiceUrl));

// SUBSCRIPTION SERVICE
app.use("/subscription", proxy(config.subscription_service, { parseReqBody: false }));

//========================= CATCH ALL FOR UNKNKNOW ROUTES ===============================================

app.use("*",(req : Request, res : Response) => {
  res.status(HttpStatus.NOT_FOUND).json({
    message : Messages.ROUTE_WILD_CARD_MESSAGE,
    success : false,
  });
});

//========================= ***************************** ================================================


export { app, server };
