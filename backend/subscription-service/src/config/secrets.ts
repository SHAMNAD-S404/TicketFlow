import dotenv from "dotenv";

export const secrets = {
    port : process.env.PORT ? Number(process.env.PORT) : 4900,
    mongoURL : process.env.MONGOURL as string,
    
}