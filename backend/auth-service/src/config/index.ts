
export interface Iconfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
}

export const config: Iconfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3001,
  mongoUri: process.env.MONGOURL as string,
  jwtSecret: process.env.JWT_SECRET as string,
};
