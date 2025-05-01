import winston from "winston";
import LokiTransport from "winston-loki";
import { v4 as uuidv4 } from "uuid";
import { loggingConfig } from "../config";

//log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  dubug: 4,
};

//level based on environment
const level = () => {
  const env = loggingConfig.NODE_ENV || "development";
  return env === "development" ? "debug" : "info";
};

//colors for each level
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  dubug: "white",
};

// add color to winston
winston.addColors(colors);

//custom format for the winston
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.metadata({ fillExcept: ["message", "level", "timestamp", "label"] }),
  winston.format.json()
);

//transport array
const transports: winston.transport[] = [
  //to console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf((info) => `${info.timestamp} ${info.level} : ${info.message}`)
    ),
  }),
  //file transporter for errors
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  //file transporter for all logs
  new winston.transports.File({ filename: "logs/all.log" }),
];

// Add Loki transport in production
if (loggingConfig.NODE_ENV === "production") {
  transports.push(
    new LokiTransport({
      host: loggingConfig.LOKI_HOST || "http://loki:3100",
      labels: {
        service: "auth-service",
        environment: loggingConfig.NODE_ENV,
      },
      json: true,
      format: winston.format.json(),
      replaceTimestamp: true,
      onConnectionError: (err) => console.log("Loki connection error : ", err),
    }) as winston.transport
  );
}

//logger creation
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

//creating req context middlewar
export const requestContext = () => {
  return (req: any, _res: any, next: any) => {
    req.id = uuidv4();
    next();
  };
};
