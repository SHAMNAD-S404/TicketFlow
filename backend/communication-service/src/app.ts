import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import validateEnvVariables from "./utils/validateEnvVariables";
import chatRoutes from "./app/routes/routes";
import notoificatoinRoutes from "./app/routes/notificationRoutes"
import morgan from "morgan"
import { Lokilogger } from "./utils/logger";



// Custom Morgan stream using Winston
const stream = {
  write: (message: string) => {
    Lokilogger.info(message.trim());
  },
};

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream }));

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request Path in ticket-service", req.path);
  console.log("Incoming Request Body in ticket-service", req.body);
  next();
});


// FOR HEALT CHECK
app.get("/health", (req, res) => {
  Lokilogger.info("Health check route accessed");
  res.status(200).send("OK");
});

app.use("/chat", chatRoutes );
app.use("/notification", notoificatoinRoutes );

export default app;
