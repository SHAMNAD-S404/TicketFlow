import redisClient from "../config/redis";

//store data in redis
export const setRedisData = async (
  key: string,
  value: any,
  ttlSeconds: number
): Promise<string | undefined> => {

  try {
    const data = await redisClient.setex(key, ttlSeconds, JSON.stringify(value));
    return data ? data : undefined;
  } catch (error) {
    console.error(error);
  }
};

//get data from redis
export const getRedisData = async (key: string) => {

  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(error);
    return error;
  }
};

//delete data from redis
export const deleteRedisData = async (key: string) => {
  
  try {
    await redisClient.del(key);
  } catch (error) {
    console.log("failed to delete the data", error);
  }
};
