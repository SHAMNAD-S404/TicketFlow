
import {channel } from './rabbitConnection';

export const publishToQueue = async (queueName : string , message : object) : Promise<void> => {
    try {

        if(!channel){
            throw new Error ("Channel is not  avilable");
        }
        //to ensure the queue exist
        await channel.assertQueue(queueName,{durable:true});

        //send message to queue
        channel.sendToQueue(queueName,Buffer.from(JSON.stringify(message) ) ,
            {persistent : true});
        
        console.log(`message sent to ${queueName} queue`);

    } catch (error) {
        console.error("Error in publishing the message ", error);
        
    }
}