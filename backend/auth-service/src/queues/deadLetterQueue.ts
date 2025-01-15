import { channel,connection } from "./connection";

export const moveToDeadLetterQueue = async(queueName: string, message: object): Promise<void> => {
    try {
        if(!channel){
            throw new Error("Channel is not available");
        } 
        
        const dlqName = `{queueName}_dlq`;
        await channel.assertQueue(dlqName, {durable: true});

        //send message to the queue
        channel.sendToQueue(dlqName, Buffer.from(JSON.stringify(message)), {persistent: true});
        console.log(`message sent to ${queueName} queue`);
        
        
        
    } catch (error) {
        console.error("Error in publishing the message", error);
    }
}