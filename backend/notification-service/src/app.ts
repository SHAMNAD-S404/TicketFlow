import express from "express";
import dotenv from "dotenv";
import { validateEnvVariables } from "./utils/validateEnv";
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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined", { stream }));

// FOR HEALT CHECK
app.get("/health", (req, res) => {
  Lokilogger.info("Health check route accessed");
  res.status(200).send("OK");
});

export default app;
