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
  if (!process.env.REDIS_HOST) {
    console.warn("REDIS_HOST is not defined, .");
  }
  if (!process.env.REDIS_PORT) {
    console.warn("REDIS_PORT is not defined,");
  }
  if (!process.env.RABBITMQ_URL) {
    console.warn("RABBITMQ_URL is not defined,");
  }
  if (!process.env.NOTIFICATION_QUEUE) {
    console.warn("NOTIFICATION_QUEUE is not defined,");
  }
  if (!process.env.AUTH_CONSUMER_QUEUE) {
    console.warn("AUTH_CONSUMER_QUEUE is not defined,");
  }
  if (!process.env.OAUTH_CLIENT_ID) {
    console.warn("OAUTH_CLIENT_ID is not defined,");
  }
  if (!process.env.SUDO_EMAIL_ID) {
    console.warn("SUDO_EMAIL_ID is not defined,");
  }
  if (!process.env.RESET_PASSWORD_LINK_URL) {
    console.warn("  RESET_PASSWORD_LINK_URL is not defined,");
  }
}
