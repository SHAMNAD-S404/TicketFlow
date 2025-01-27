import dotenv from "dotenv";
import express,{Request,Response,NextFunction} from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import companyRoutes from './app/routes/companyRoutes'
import departmentRoutes from './app/routes/departmentRoutes'


dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));




app.use((req: Request, res: Response, next: NextFunction) => {
    console.log("Incoming Request Path in Company-service", req.path);
    console.log("Incoming Request Body in Company-service", req.body);
    next();
});

app.use("/comp/",companyRoutes)
app.use("/dept/",departmentRoutes)


export default app;
