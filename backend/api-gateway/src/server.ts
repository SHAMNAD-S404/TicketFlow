import app from "./app";
import { config } from "./config";

const startServer = () => {
  app.listen(config.port, () => {
    console.log(`✅ API Gateway is running at http://localhost:${config.port}`);
  });
};

startServer();
