export function validateEnvVariables(): void {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the environment variables!");
    }
    if (!process.env.MONGOURL) {
      throw new Error("MONGOURL is not defined in the environment variables!");
    }
    if (!process.env.PORT) {
      console.warn("PORT is not defined, defaulting to 3001.");
    }
  }
  