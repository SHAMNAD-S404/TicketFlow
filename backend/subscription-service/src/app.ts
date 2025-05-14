import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import router from "./app/routes/paymentRoute";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { Lokilogger } from "./utils/lokiLogger";

// Custom Morgan stream using Winston
const stream = {
  write: (message: string) => {
    Lokilogger.info(message.trim());
  },
};


dotenv.config();
validateEnvVariables();

const app = express();

app.use(cookieParser());
app.use(morgan("combined", { stream }));

// FOR HEALT CHECK
app.get("/health", (req, res) => {
  Lokilogger.info("Health check route accessed");
  res.status(200).send("OK");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request Path in ticket-service", req.path);
  console.log("Incoming Request Body in ticket-service", req.body);
  next();
});

// Register routes
app.use("/", router);

export default app;
