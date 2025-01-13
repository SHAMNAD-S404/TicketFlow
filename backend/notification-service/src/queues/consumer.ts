import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmqConfig";

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
      (message) => {
        if (message) {
          const input = JSON.parse(message.content.toString());
          console.log("Recieved message in notifiction queue, mssg : ", input);

          //send mail functionality
          sendMail(input.email, input.message);

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

const sendMail = (email:string,message:string) => {
    console.log("sending mail to : ",email,"the message is : ",message);
}
