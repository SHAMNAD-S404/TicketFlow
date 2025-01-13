import app from "./app";
import { config } from "./config";
import { startConsumer } from "./queues/consumer";

const startServer = async () => {
    try {
        await startConsumer();
            console.log("✅ Notification consumer started");
        app.listen(config.port,() => {
            console.log(`✅ Notification service is running at http://localhost:${config.port}`);
        })
    } catch (error) {
        console.error("❌ Error starting server:", error);
        process.exit(1);
    }
}

startServer();