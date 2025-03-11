import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { connectRabbitMQ } from "./queues/rabbitConnection";

const startServer = async () => {
  try {
    await Promise.all([
      mongoose.connect(config.mongoUri).then(() => console.log("✅ Ticket-service connected to the database!")),
      connectRabbitMQ().then(() => console.log("🐇 Ticket-service connected to RabbitMQ!")
      )
    ]);

    app.listen(config.port, () => {
      console.log(`✅ Ticket service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
