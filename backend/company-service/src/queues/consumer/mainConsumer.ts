import { RabbitMQConfig } from "../../config/rabbitMQ";
import { EventType } from "../../constants/queueEventsType";
import { channel } from "../rabbitConnection";




const handleUserStatusUpdate = async (data:any) => {
    console.log(data);
    
}


const evnetHandler : {[key:string]:(data : any) => void } = {
    [EventType.COMPANY_STATUS_UPDATE]  : handleUserStatusUpdate,
}



export const mainConsumer = async () : Promise<void> => {

    try {
        await channel.assertQueue(RabbitMQConfig.companyMainQueue , {
            durable : true
        })
        console.log("🐇 Company Main consumer queue created");

        channel.consume(
            RabbitMQConfig.companyMainQueue,
            async(message) => {
                if(!message) return;

                const data = JSON.parse(message.content.toString());
                const eventType = data.eventType;
                console.log(`📩 Received event: ${eventType}`, data)

                //route message to correct handler
                const handler = evnetHandler[eventType];
                if(handler){
                    await handler(data);
                }else{
                    console.warn("No handler found for event type :",eventType);
                    
                }
                channel.ack(message)
            }
        )



    } catch (error) {

        console.error("Error in consuming company main consumer queue",error); 
        
    }
}