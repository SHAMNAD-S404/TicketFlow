import dotenv from "dotenv";
dotenv.config();

export const secrets = {
    port : process.env.PORT ? Number(process.env.PORT) : 4900,
    mongoURL : process.env.MONGOURL as string,
    stripe_secret_key : process.env.STRIPE_SECRET_KEY as string,
    stripe_webhook_secret : process.env.STRIPE_WEBHOOK_SECRET as string,
    jwt_secret : process.env.JWT_SECRET as string,
    
}

//LOGGING CONFIG FILES

export const loggingConfig = {
    NODE_ENV : process.env.NODE_ENV as string,
    LOKI_HOST : process.env.LOKI_HOST as string,
  }
  