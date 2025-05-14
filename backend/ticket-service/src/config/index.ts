
import dotenv from "dotenv"
dotenv.config()

export interface Iconfig {
    port : number,
    mongoUri: string;
  cloudName : string,
  cloudApiKey : string,
  cloudApiSecret : string,
 
  
}

export const config: Iconfig = {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4401,
    mongoUri: process.env.MONGOURL as string,
    cloudName : process.env.CLOUDINARY_CLOUD_NAME as string,
    cloudApiKey : process.env.CLOUDINARY_API_KEY as string,
    cloudApiSecret : process.env.CLOUDINARY_API_SECRET as string,
  
  };

  //LOGGING CONFIG FILES

export const loggingConfig = {
  NODE_ENV : process.env.NODE_ENV as string,
  LOKI_HOST : process.env.LOKI_HOST as string,
}
