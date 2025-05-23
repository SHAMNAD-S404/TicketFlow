import { RabbitMQConfig } from "../../config/rabbitmq";
import { ConsumerEventType } from "../../constants/consumerEventTypes";
import { channel } from "../connection";
import { createAuthUserHandler } from "../eventHandlers/authHandler";

const eventHandlerMap: { [key: string]: (data: any) => Promise<void> } = {
  [ConsumerEventType.CREATE_AUTH_USER]: createAuthUserHandler,
};

// Consumer setup for auth service
export const authMainConsumer = async (): Promise<void> => {
  try {

    if (!channel) throw new Error("RabbitMQ channel not initialized");

    await channel.assertQueue(RabbitMQConfig.authConsumerQueue, {
      durable: true,
    });
    console.log("🐇 Auth Main consumer queue created");

    channel.consume(RabbitMQConfig.authConsumerQueue, async (message) => {
      if (!message) return;

      const data = JSON.parse(message.content.toString());
      const eventType = data.eventType;

      console.log(`📩 Received event: ${eventType}`, data);

      const handler = eventHandlerMap[eventType];
      if (handler) {
        await handler(data);
      } else {
        console.warn("⚠️ No handler found for event type:", eventType);
      }

      channel!.ack(message);
    });
  } catch (error) {
    console.error("❌ Error in consuming Auth main queue", error);
  }
};
