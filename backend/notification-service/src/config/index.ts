export interface Iconfig {
    port: number;
}

export const config: Iconfig = {
    port : process.env.PORT ? parseInt(process.env.PORT,10) : 4201,
}