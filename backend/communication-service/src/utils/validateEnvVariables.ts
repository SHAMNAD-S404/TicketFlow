function validateEnvVariables(): void {
  if (!process.env.MONGOURL) {
    console.warn("MONGOURL is not defined in the environment variables!");
  }
  if (!process.env.PORT) {
    console.warn("PORT is not defined,");
  }
  if (!process.env.RABBITMQ_URL) {
    console.warn("RABBITMQ_URL is not defined,");
  }
  if (!process.env.NOTIFICATION_QUEUE) {
    console.warn("NOTIFICATION_QUEUE is not defined,");
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
  if (!process.env.FRONTEND_URL) {
    console.warn("process.env.FRONTEND_URL is not defined");
  }
}
export default validateEnvVariables;
