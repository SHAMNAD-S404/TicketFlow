import winston from "winston";
import LokiTransport from "winston-loki";
import { v4 as uuidv4 } from "uuid";
import { loggingConfig } from "../config";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4, 
};

// Format for Loki
const lokiFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

// Format for console and file
const standardFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  winston.format.json()
);

// Loki transport configuration
const lokiTransportConfig = {
  host: loggingConfig.LOKI_HOST || "http://loki:3100",
  batching: true,
  interval: 5,  // Send logs every 5 seconds
  labels: {
    app: "auth-service",
    environment: loggingConfig.NODE_ENV || "development",
  },
  format: lokiFormat,
  json: true,
  replaceTimestamp: true,
  onConnectionError: (err: any) => {
    console.error("Loki connection error:", err);
  }
};

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
  }),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ 
    filename: "logs/all.log" 
  }),
  new LokiTransport(lokiTransportConfig) as winston.transport
];

export const logger = winston.createLogger({
  level: loggingConfig.NODE_ENV === "development" ? "debug" : "info",
  levels,
  format: standardFormat,
  transports,
  defaultMeta: {
    service: "auth-service",
    environment: loggingConfig.NODE_ENV || "development"
  }
});

export const requestContext = () => {
  return (req: any, _res: any, next: any) => {
    req.id = uuidv4();
    req.startTime = Date.now();  // Add request start time
    next();
  };
};

// a test log on initialization
logger.info("Logger initialized", {
  timestamp: new Date().toISOString(),
  config: {
    lokiHost: loggingConfig.LOKI_HOST,
    environment: loggingConfig.NODE_ENV
  }
});