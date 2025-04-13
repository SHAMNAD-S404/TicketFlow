import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import router from "./app/routes/paymentRoute";


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


// Register routes
app.use("/api/payment", router);

export default app;
