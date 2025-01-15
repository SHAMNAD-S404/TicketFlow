import { channel } from "./connection";
import { moveToDeadLetterQueue } from "./deadLetterQueue";


export const publishToQueueWithRPCAndRetry = async (
    queueName: string,
    message: object,
    maxRetries = 3
  ): Promise<any> => {
    try {
      if (!channel) {
        throw new Error("Channel is not available");
      }
  
      const correlationId = Math.random().toString(36).slice(2);
      const replyQueue = await channel.assertQueue("", { exclusive: true });
      let retries = 0;
  
      while (retries < maxRetries) {
        try {
          console.log(`Attempt ${retries + 1} to send message to ${queueName} queue`);
  
          // Send message to queue
          channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            correlationId,
            replyTo: replyQueue.queue,
          });
  
          // Await response
          const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error("Timeout waiting for RPC response"));
            }, 15000);
            
            if (channel) {
               channel.consume(
              replyQueue.queue,
              (msg) => {
                if (msg?.properties.correlationId === correlationId) {
                  clearTimeout(timeout);
                  resolve(JSON.parse(msg.content.toString()));
                  channel?.deleteQueue(replyQueue.queue);
                }
              },
              { noAck: true }
            ); 
            }
            
          });
  
          console.log(`RPC response received:`, response);
          return response;
        } catch (error) {
          retries++;
          console.error(`RPC call failed on attempt ${retries}/${maxRetries}:`, error);
  
          if (retries === maxRetries) {
            console.error("Max retries reached. Moving message to dead-letter queue");
            await moveToDeadLetterQueue(queueName, message);
            throw new Error("Failed to process message after maximum retries");
          }
        }
      }
    } catch (error) {
      console.error("Error in publishToQueueWithRPCAndRetry:", error);
      throw error;
    }
  };
  