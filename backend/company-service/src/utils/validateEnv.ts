export function validateEnvVariables(): void {
  
  if (!process.env.MONGOURL) {
    throw new Error("MONGOURL is not defined in the environment variables!");
  }
  if (!process.env.PORT) {
    console.warn("PORT is not defined, defaulting to 3001.");
  }
  if (!process.env.RABBITMQ_URL) {
    console.warn("RABBITMQ_URL is not defined,");
  }
  if (!process.env.COMPANY_RPC_QUEUE) {
    console.warn("COMPANY_RPC_QUEUE is not defined,");
  }
  if (!process.env.AUTH_CONSUMER_QUEUE) {
    console.warn("AUTH_CONSUMER_QUEUE is not defined,");
  }
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("CLOUDINARY_CLOUD_NAME is not defined,");
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    console.warn("CLOUDINARY_API_KEY is not defined,");
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.warn("CLOUDINARY_API_SECRET is not defined,");
  }


}
