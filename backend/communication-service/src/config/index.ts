import dotenv from "dotenv";
dotenv.config();

export interface Iconfig {
  port: number;
  mongoUrl: string;
  cloudName: string;
  cloudApiKey: string;
  cloudApiSecret: string;
  FRONTEND_URL : string;
  FRONTEND_PRODUCTION_URL : string;
}

export const config: Iconfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4401,
  mongoUrl: process.env.MONGOURL as string,
  cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudApiSecret: process.env.CLOUDINARY_API_SECRET as string,
  FRONTEND_URL : process.env.FRONTEND_URL as string,
  FRONTEND_PRODUCTION_URL : process.env.FRONTEND_PRODUCTION_URL as string,
};
