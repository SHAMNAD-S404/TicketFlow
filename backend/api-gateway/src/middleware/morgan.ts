import morgan from "morgan";
import { logger } from "../util/logger";

//overiding the stream method with custom logger
const stream = {
  //use http serverity
  write: (message: string) => logger.http(message.trim()),
};

//morgan middleware building
const morganMiddleware = morgan(
  //message format string
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default morganMiddleware;
