import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import { configurePaymentRoutes } from "./app/routes/paymentRoute";
import { PaymentRepository } from "./app/repositories/implements/paymentRepo";
import { PaymentService } from "./app/service/implements/paymentService";
import { PaymentController } from "./app/controllers/implementations/paymentController";

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

// Initialize repositories, services, and controllers
const paymentRepo = new PaymentRepository();
const paymentService = new PaymentService(process.env.STRIPE_SECRET_KEY || "", paymentRepo);
const paymentController = new PaymentController(
  paymentService,
  process.env.STRIPE_SECRET_KEY || "",
  process.env.STRIPE_WEBHOOK_SECRET || ""
);

// Configure routes
const paymentRoutes = configurePaymentRoutes(paymentController);

// Register routes
app.use("/api/payment", paymentRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
