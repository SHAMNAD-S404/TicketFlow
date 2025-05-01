import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { connectRabbitMQ } from "./queues/connection";
import { authMainConsumer } from "./queues/consumers/authConsumer";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    await Promise.all([
      mongoose.connect(config.mongoUri).then(() => console.log("✅ Auth-service connected to the database!")),
      connectRabbitMQ().then(() => console.log("🐇 Auth-service connected to RabbitMQ!")),
    ]);
    await authMainConsumer();
    console.log("auth service consumer started ..");

    app.listen(config.port, () => {
      console.log(`✅ Auth service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    logger.error("Error in starting server", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

startServer();
