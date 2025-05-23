import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";
import { connectRabbitMQ } from "./queues/connection";
import { authMainConsumer } from "./queues/consumers/authConsumer";
import { BasicMessages } from "./constants/basicMessages";

const startServer = async () => {
  try {
    
    // Establishes asynchronous connections to MongoDB Atlas and RabbitMQ.
    await Promise.all([
      mongoose
        .connect(config.mongoUri)
        .then(() => console.log(BasicMessages.AUTH_DB_CONNECTION_SUCCESS)),
      connectRabbitMQ().then(() => console.log(BasicMessages.AUTH_RABBIT_CONNECTION_SUCCESS)),
    ]);

    // Established Rabbitmq consumer
    await authMainConsumer();
    console.log(BasicMessages.AUTH_CONSUMER_STARTED);

    // Starting server
    app.listen(config.port, () => {
      console.log(`✅ Auth service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error(BasicMessages.SERVER_ERR_STARTING, error);
    process.exit(1);
  }
};

startServer();
