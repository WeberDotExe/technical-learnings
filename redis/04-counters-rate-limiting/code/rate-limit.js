import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL,
});

redisClient.on('error',(error)=>{
    console.error("redis client error",error)
});

await redisClient.connect();

console.log("redis client connected successfully");

//Rate limit checking
const userId = "42";
const maxRequest = 5;
const windowSecond = 60;

const rateLimitKey = `rate-limit-ai:${userId}`

const requestCount = await redisClient.incr(rateLimitKey);
//if this is first req start 60s window
if(requestCount === 1){
    await redisClient.expire(rateLimitKey,windowSecond)
}

const ttl = await redisClient.ttl(rateLimitKey);

console.log("\nREquest count:", requestCount);
console.log("remaining request",Math.max(0,maxRequest-requestCount));
console.log("window ttl",ttl);

if(requestCount > maxRequest){
    console.log("rate limit exceeded")
}else{
    console.log("request allowed");
}

await redisClient.quit();
