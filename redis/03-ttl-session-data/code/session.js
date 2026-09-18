import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error",(error)=>{
    console.error("Redis Client Error", error)
});

await redisClient.connect();

console.log("redis client connected successfully");

// start a practise session
const sessionkey = "practise:1:session";

const sessionData = {
    status:"active",
    topic:"interview",
    mode:"text",
}

//store session data with thirty seconds TTL
await redisClient.set(sessionkey, JSON.stringify(sessionData),{EX:30});

console.log("\npractise session started");

console.log("Session",JSON.parse(await redisClient.get(sessionkey)));

console.log("TTL:",await redisClient.ttl(sessionkey));

//simulate user activity
console.log("\nuser sent a message");

//simulate the session ttl
await redisClient.expire(sessionkey, 30);

console.log("TTL: after activity",await redisClient.ttl(sessionkey));

await redisClient.quit();