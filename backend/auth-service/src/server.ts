import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { connectRabbitMQ } from "./queues/connection";
import { consumeAuthData } from "./queues/consumers/authConsumer";

const startServer = async () => {
  try {
    
    await Promise.all([
      mongoose.connect(config.mongoUri).then(() => console.log("✅ Auth-service connected to the database!")),
      connectRabbitMQ().then(() => console.log("🐇 Auth-service connected to RabbitMQ!"))
    ]); 
    await consumeAuthData();
    console.log("auth service consumer started ..")   

    app.listen(config.port, () => {
        console.log(`✅ Auth service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
