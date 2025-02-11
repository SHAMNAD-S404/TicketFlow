import dotenv from "dotenv";
dotenv.config();

export interface Iconfig {
  port: number;
  authServiceUrl: string;
  companyServiceUrl: string;
  jwtSecret: string
  frontend_URL : string;
}

export const config: Iconfig = {
  port: process.env.PORT ? Number(process.env.PORT) : 3001,
  authServiceUrl: process.env.AUTH_SERVICE_URL as string,
  companyServiceUrl: process.env.COMPANY_SERVICE_URL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  frontend_URL: process.env.FRONTEND_URL as string,
};
