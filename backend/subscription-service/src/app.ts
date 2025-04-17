import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import router from "./app/routes/paymentRoute";
import cookieParser from "cookie-parser";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(cookieParser())

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request Path in ticket-service", req.path);
  console.log("Incoming Request Body in ticket-service", req.body);
  next();
});


// Register routes
app.use("/", router);

export default app;
