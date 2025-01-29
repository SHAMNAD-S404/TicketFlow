// import amqplib from "amqplib";
// import { RabbitMQConfig } from "../config/rabbitmqConfig";
// import { sendEmail } from "../utils/sendEmail";

// export const startConsumer = async () => {
//   try {
//     const connection = await amqplib.connect(RabbitMQConfig.url);
//     const channel = await connection.createChannel();

//     //assert queue
//     await channel.assertQueue(RabbitMQConfig.notificationQueue, {
//       durable: true,
//     });

//     //consume the message from the queue
//     channel.consume(
//       RabbitMQConfig.notificationQueue,
//       async (message) => {
//         if (message) {
//           const input = JSON.parse(message.content.toString());
//           console.log("Recieved message in notifiction queue, mssg : ", input);

//           //send mail functionality
//           const { email, otp, content, subject, template } = input;
//           await sendEmail(email, subject, template, { otp, content });

//           //acknowledge the message
//           channel.ack(message);
//         }
//       },
//       { noAck: false }
//     );
//   } catch (error) {
//     console.error("Error in notification consumer", error);
//   }
// };


import amqplib from "amqplib";
import { RabbitMQConfig } from "../config/rabbitmqConfig";
import { sendEmail } from "../utils/sendEmail";

export const startConsumer = async () => {
  try {
    const connection = await amqplib.connect(RabbitMQConfig.url);
    const channel = await connection.createChannel();

    // Assert the queue
    await channel.assertQueue(RabbitMQConfig.notificationQueue, {
      durable: true,
    });

    // Consume messages from the queue
    channel.consume(
      RabbitMQConfig.notificationQueue,
      async (message) => {
        if (message) {
          const input = JSON.parse(message.content.toString());
          console.log("Received message in notification queue:", input);

          const { email, subject, template, type, content, otp,  password } = input;

          try {
            // Handle different types of notifications dynamically
            switch (type) {
              case "registration":
                await sendEmail(email, subject, template, { otp, content });
                break;

              case "sendLoginDetails":
                // Send email with login details
                await sendEmail(email, subject, template, {
                  email,
                  password,
                  content,
                });
                break;

              default:
                console.error("Unknown notification type:", type);
                break;
            }

            // Acknowledge the message
            channel.ack(message);
          } catch (error) {
            console.error("Failed to process notification:", error);
            // Optionally, do not acknowledge the message for retry logic
          }
        }
      },
      { noAck: false } // Messages must be acknowledged
    );
  } catch (error) {
    console.error("Error in notification consumer:", error);
  }
};

