import { server } from "./app";
import { config } from "./config";

const startServer = () => {
  try {
    server.listen(config.port, () => {
      console.log(`✅ API Gateway is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();
