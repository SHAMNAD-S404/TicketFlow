import { createLogger,format,transports } from "winston";
import LokiTransport from "winston-loki";
import { loggingConfig } from "../config/secrets";


export const Lokilogger = createLogger({
    level : "info",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [
        new LokiTransport({
            host: loggingConfig.LOKI_HOST || "http://loki:3100",
            labels : { service: "subscription-service"},
            json: true,
            replaceTimestamp: true,
        }),
    ],
});