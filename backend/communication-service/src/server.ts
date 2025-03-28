import mongoose from "mongoose";
import app from "./app";
import Messages from "./constants/Messages";
import { config } from "./config";
import { server } from "./socket";

const startServer = async () => {
  try {
    await mongoose.connect(config.mongoUrl);
    console.log(Messages.DB_CONNECTION_SUCCESS);

    server.listen(config.port, () => {
      console.log(`✅ Communication service is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error(Messages.SERVER_START_ERROR, error);
    process.exit(1);
  }
};

startServer();
