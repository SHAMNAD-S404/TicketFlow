export function validateEnvVariables(): void {

    if(!process.env.PORT){
        throw new Error("PORT is not defined, defaulting to 3001");
    }
    if(!process.env.RABBITMQ_URL){
        throw new Error("RABBITMQ_URL is not defined");
    }
    if(!process.env.NOTIFICATION_QUEUE){
        throw new Error("NOTIFICATION_QUEUE is not defined");
    }
}