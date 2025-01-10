import mongoose from "mongoose";
import app from "./app";
import { config } from "./config";

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log("✅ Company-service connected to the database!");

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
