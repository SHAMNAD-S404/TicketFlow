import { RabbitMQConfig } from "../../config/RabbitMQConfig";
import { sendNotification } from "../eventHandlers/notificationEventHandler";
import { EventType } from "../EventType";
import { channel } from "../rabbitConnection";

const evnetHandler: { [key: string]: (data: any) => void } = {
  //@EventType is  enum const
  [EventType.TICKET_ASSIGNED]: sendNotification,
  [EventType.TICKET_STATUS_CHANGED]: sendNotification,
  [EventType.OTHER]: sendNotification,
};

export const mainConsumer = async (): Promise<void> => {
  try {
    await channel.assertQueue(RabbitMQConfig.COMMUNICATION_QUEUE, {
      durable: true,
    });
    console.log("🐇 Communication Main consumer queue created");

    channel.consume(RabbitMQConfig.COMMUNICATION_QUEUE, async (message: any) => {
      if (!message) return;

      const data = JSON.parse(message.content.toString());
      //deriving the event type from the data we got
      const eventType = data.eventType;
      console.log(`📩 Received event: ${eventType}`, data);

      //route message to correct handler
      const handler = evnetHandler[eventType];
      if (handler) {
        await handler(data);
      } else {
        console.warn("No handler found for event type :", eventType);
      }
      channel.ack(message);
    });
  } catch (error) {
    console.error("Error in consuming company main consumer queue", error);
  }
};
