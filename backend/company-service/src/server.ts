import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { connectRabbitMQ } from "./queues/rabbitConnection";
import {consumeRPCRequest} from "./queues/consumerWithRPC"


const startServer = async () => {
  try {

    await Promise.all([
      mongoose.connect(config.mongoUri).then(() => console.log("✅ Company-service connected to the database!")),
      connectRabbitMQ().then(() => console.log("🐇 Company-service connected to RabbitMQ!"))
      
    ]);
    
    await consumeRPCRequest();
    
    app.listen(config.port, () => {
      console.log(
        `✅ Company service is running at http://localhost:${config.port}`
      );
    });

  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
};

startServer();
