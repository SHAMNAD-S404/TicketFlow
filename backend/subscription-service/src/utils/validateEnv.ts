export function validateEnvVariables(): void {
  
    if (!process.env.MONGOURL) {
      console.warn("MONGOURL is not defined in the environment variables!");
    }
    if (!process.env.PORT) {
      console.warn("PORT is not defined,");
    }
  
  }
  