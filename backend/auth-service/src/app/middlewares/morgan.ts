import morgan from "morgan";
import { logger } from "../../utils/logger";

// Create custom token for request ID
morgan.token('id', function (req: any) {
  return req.id;
});

// Create custom token for response time
morgan.token('response-time-ms', function (req: any) {
  const time = Date.now() - req.startTime;
  return time.toString();
});

// Custom format string
const morganFormat = [
  ':id',
  ':remote-addr',
  ':method',
  ':url',
  'HTTP/:http-version',
  ':status',
  ':response-time-ms ms',
  '":referrer"',
  '":user-agent"'
].join(' ');

const stream = {
  write: (message: string) => {
    logger.http(message.trim(), {
      timestamp: new Date().toISOString(),
      labels: {
        type: 'access_log'
      }
    });
  },
};

const morganMiddleware = morgan(morganFormat, { stream });

export default morganMiddleware;