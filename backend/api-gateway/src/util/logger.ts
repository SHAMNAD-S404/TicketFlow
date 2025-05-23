import { createLogger, format } from "winston";
import LokiTransport from "winston-loki";
import { loggingConfig } from "../config";

export const Lokilogger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new LokiTransport({
      host: loggingConfig.LOKI_HOST || "http://loki:3100",
      labels: { service: "api-gateway" },
      json: true,
      replaceTimestamp: true,
    }),
  ],
});
