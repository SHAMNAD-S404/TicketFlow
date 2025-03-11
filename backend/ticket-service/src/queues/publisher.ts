import { Messages } from "../constants/messageConstants";
import { channel } from "./rabbitConnection";

export const publishToQueue = async (queueName: string, message: object): Promise<void> => {
  try {
    if (!channel) {
      throw new Error(Messages.CHANNEL_NOT_AVILABLE);
    }

    //to ensure the queue is exist
    await channel.assertQueue(queueName, { durable: true });

    //send message to queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), { persistent: true });

    console.log(`message sent to ${queueName} queue`);
  } catch (error) {
    console.error(Messages.ERROR_PUBLISH_MSSG);
  }
};
