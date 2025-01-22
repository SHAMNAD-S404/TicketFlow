import dotenv from "dotenv";
import express,{Request,Response,NextFunction} from "express";
import { validateEnvVariables } from "./utils/validateEnv";
import companyRoutes from './app/routes/companyRoutes'
// import {UserData} from './app/interfaces/userTokenData'

dotenv.config();
validateEnvVariables();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// let currentUser : UserData | null = null;

app.use((req: Request, res: Response, next: NextFunction) => {
    //const userData = req.headers['x-user-data'];
    console.log("Incoming Request Path in Company-service", req.path);
    console.log("Incoming Request Body in Company-service", req.body);
    // if(userData && typeof userData === "string"){
    //    currentUser = JSON.parse(userData);
    //    console.log(currentUser)
    // }
    next();
});

app.use("/",companyRoutes)


export default app;
