

import { RabbitMQConfig } from "../config/rabbitmqConfig";
import { processMessage } from "./messageHandler";
import { getRabbitMQChannel } from "./connection";

export const startConsumerQueue = async (): Promise<void> => {
  try {
    const channel = await getRabbitMQChannel();

    await channel.assertQueue(RabbitMQConfig.notificationQueue, { durable: true });
    console.log("🎯 Listening for messages on:", RabbitMQConfig.notificationQueue);

    //consume message
    channel.consume(
      RabbitMQConfig.notificationQueue,
      async (message) => {
        if (!message) return;

        try {
          const payload = JSON.parse(message.content.toString());
          console.log("📩 Received message:", payload);

          await processMessage(payload.type, payload);

          //acknowledging the message
          channel.ack(message);
        } catch (error) {
          console.error("❌ Message processing failed:", error);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("❌ Error in notification consumer:", error);
  }
};
