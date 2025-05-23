import app from "./app";
import { secrets } from "./config/secrets";
import { connectRabbitMQ } from "./queues/rabbitConnection";
import { verifyDBConnection } from "./utils/verifyDBConnection";
import { Messages } from "./constants/messageConstants";

const startServer = async () => {
  try {
    await Promise.all([
      connectRabbitMQ().then(() => console.log("🐇 subscription-service connected to RabbitMQ!")),
    ]);

    const DBConnect = await verifyDBConnection();
    if (DBConnect) {
      console.log(Messages.DATABASE_CONNECT_SUCCESS);
    } else {
      console.log(Messages.DATABASE_CONNECT_FAIL);
    }

    app.listen(secrets.port, () => {
      console.log(`✅ Subscription service is running at http://localhost:${secrets.port}`);
    });
  } catch (error) {
    console.error(Messages.START_SERVER_ERROR, error);
    process.exit(1);
  }
};

startServer();
