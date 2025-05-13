import { createLogger,format,transports } from "winston";
import LokiTransport from "winston-loki";
import { loggingConfig } from "../config";


export const logger = createLogger({
    level : "info",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console(),
        new LokiTransport({
            host: loggingConfig.LOKI_HOST || "http://loki:3100",
            labels : { service: "auth-service"  },
            json: true,
            replaceTimestamp: true,
        }),
    ],
});

