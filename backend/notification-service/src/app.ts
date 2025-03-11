import express from "express";
import dotenv from "dotenv";
import { validateEnvVariables } from "./utils/validateEnv";

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));


export default app;