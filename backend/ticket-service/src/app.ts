import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import ticketRoutes from "./app/routes/ticketRoutes";
import { validateEnvVariables } from "./utils/validateEnv";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request Path in ticket-service", req.path);
  console.log("Incoming Request Body in ticket-service", req.body);
  next();
});

app.use("/", ticketRoutes);

export default app;
