import Redis from "ioredis";

//create a new redis instance
const redisClient = new Redis({

    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : undefined,

})

redisClient.on("connect",() => {
    console.log("✅ connected to redis");
    
})

redisClient.on("error", (error:Error) => {
    console.log("error in redis",error);
})

export default redisClient;