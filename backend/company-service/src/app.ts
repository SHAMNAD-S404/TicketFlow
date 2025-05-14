import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import companyRoutes from "./app/routes/companyRoutes";
import departmentRoutes from "./app/routes/departmentRoutes";
import employeeRoutes from "./app/routes/employeeRoutes";
import morgan from "morgan"
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream }));


app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("Incoming Request Path in Company-service", req.path);
  console.log("Incoming Request Body in Company-service", req.body);
  next();
});

// FOR HEALT CHECK
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use("/comp/", companyRoutes);
app.use("/dept/", departmentRoutes);
app.use("/emp/", employeeRoutes);

export default app;
