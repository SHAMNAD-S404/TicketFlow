import mongoose from "mongoose";
import app from "./app";
import { secrets } from "./config/secrets";
import { connectRabbitMQ } from "./queues/rabbitConnection";

const startServer = async () => {
  try {
    await Promise.all([
      mongoose.connect(secrets.mongoURL).then(()=> console.log("✅ subscription-service connected to the database!")),
      connectRabbitMQ().then(() => console.log("🐇 subscription-service connected to RabbitMQ!"  ))
    ]);

    app.listen(secrets.port, ()=> {
      console.log(`✅ Subscription service is running at http://localhost:${secrets.port}`);
      
    })
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

startServer();