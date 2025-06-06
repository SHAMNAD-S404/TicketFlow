
export interface Iconfig {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  OAuthClientId : string;
  superAdminEmail:string;
  jwtRefreshSecret: string;
  resetPasswordUrlLink : string
}

export const config: Iconfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 4001,
  mongoUri: process.env.MONGOURL as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtRefreshSecret : process.env.REFRESH_TOKEN_SECRET as string,
  OAuthClientId : process.env.OAUTH_CLIENT_ID as string,
  superAdminEmail: process.env.SUDO_EMAIL_ID as string,
  resetPasswordUrlLink : process.env.RESET_PASSWORD_LINK_URL as string,
};

//LOGGING CONFIG FILES

export const loggingConfig = {
  NODE_ENV : process.env.NODE_ENV as string,
  LOKI_HOST : process.env.LOKI_HOST as string,
}
