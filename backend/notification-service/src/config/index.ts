export interface Iconfig {
    port: number;
}

export const config: Iconfig = {
    port : process.env.PORT ? parseInt(process.env.PORT,10) : 4201,
}


//LOGGING CONFIG FILES

export const loggingConfig = {
    NODE_ENV : process.env.NODE_ENV as string,
    LOKI_HOST : process.env.LOKI_HOST as string,
  }