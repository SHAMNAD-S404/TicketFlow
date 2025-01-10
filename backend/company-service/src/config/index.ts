export interface Iconfig {
  port: number;
  mongoUri: string;
}

export const config: Iconfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4101,
  mongoUri: process.env.MONGOURL as string,
};
