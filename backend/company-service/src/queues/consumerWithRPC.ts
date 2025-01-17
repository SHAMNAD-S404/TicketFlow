import { RabbitMQConfig } from "../config/rabbitMQ";
import { channel } from "./rabbitConnection";
import CompanyService from "../app/services/implements/companyService";

const companyService = new CompanyService();

export const consumeRPCRequest = async (): Promise<void> => {
  try {
    await channel.assertQueue(RabbitMQConfig.compnayRPCQueue, {
      durable: true,
    });
    console.log("🐇 Company RPC consumer queue created");

    console.log(`Waiting for messages in ${RabbitMQConfig.compnayRPCQueue}`);

    // Consume messages from the queue
    channel.consume(
      RabbitMQConfig.compnayRPCQueue,
      async (message) => {
        if (!message) return;

        const { content, properties } = message;

        try {
          const requestData = JSON.parse(content.toString());
          console.log("Received message in company RPC queue:", requestData);

          // Store data in company database using company service
          const result = await companyService.createCompany(requestData);

          // Send a response to the reply queue
          if (properties.replyTo && properties.correlationId) {
            channel.sendToQueue(
              properties.replyTo,
              Buffer.from(JSON.stringify(result)),
              { correlationId: properties.correlationId }
            );
          }

          // Acknowledge the message
          channel.ack(message);
        } catch (error) {
          console.error("Error processing message:", error);

          // Send an error response to the reply queue
          if (properties.replyTo && properties.correlationId) {
            channel.sendToQueue(
              properties.replyTo,
              Buffer.from(JSON.stringify({ success: false, error })),
              { correlationId: properties.correlationId }
            );
          }

          // Acknowledge the message
          channel.ack(message);
        }
      },
      { noAck: false } // Ensure messages are acknowledged after processing
    );
  } catch (error) {
    console.error("Error setting up consumer:", error);
  }
};
