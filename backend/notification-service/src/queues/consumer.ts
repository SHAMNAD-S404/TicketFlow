import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmqConfig";
import { sendEmail } from "../utils/sendEmail";

export const startConsumer = async () => {
  try {
    const connection = await amqplib.connect(RabbitMQConfig.url);
    const channel = await connection.createChannel();

    //assert queue
    await channel.assertQueue(RabbitMQConfig.notificationQueue, {
      durable: true,
    });

    //consume the message from the queue
    channel.consume(
      RabbitMQConfig.notificationQueue,
      async (message) => {
        if (message) {
          const input = JSON.parse(message.content.toString());
          console.log("Recieved message in notifiction queue, mssg : ", input);

          //send mail functionality
          const { email, otp, content, subject, template } = input;
          await sendEmail(email, subject, template, { otp, content });

          //acknowledge the message
          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Error in notification consumer", error);
  }
};
