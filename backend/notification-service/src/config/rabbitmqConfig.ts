

export interface IRabbitMQConfig {
    url:string;
    notificationQueue: string;
}
console.log(`${process.env.RABBITMQ_URL} ${process.env.NOTIFICATION_QUEUE}`);

export const RabbitMQConfig : IRabbitMQConfig= {
    
    url:process.env.RABBITMQ_URL as string,
    notificationQueue: process.env.NOTIFICATION_QUEUE as string
    
}