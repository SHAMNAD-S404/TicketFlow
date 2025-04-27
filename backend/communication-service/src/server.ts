import mongoose from "mongoose";
import Messages from "./constants/Messages";
import { config } from "./config";
import { server } from "./socket";
import { mainConsumer } from "./queues/consumer/mainConsumer";
import { connectRabbitMQ } from "./queues/rabbitConnection";

const startServer = async () => {
  try {
    await Promise.all([
      mongoose.connect(config.mongoUrl).then(() => console.log(Messages.DB_CONNECTION_SUCCESS)),
      connectRabbitMQ().then(() => console.log("🐇 Communication-service connected to RabbitMQ!")),
    ]);

    await mainConsumer().then(() => console.log("Main Consumer started ."));

    server.listen(config.port, () => {
      console.log(`✅ Communication service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error(Messages.SERVER_START_ERROR, error);
    process.exit(1);
  }
};

startServer();
