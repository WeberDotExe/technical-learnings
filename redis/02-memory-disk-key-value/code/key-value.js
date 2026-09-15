import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({url:process.env.REDIS_URL});

redisClient.on("error",(error)=>{
    console.error("Redis Client Error",error);
})

await redisClient.connect();

console.log("redis client connected successfully");

// here we will sTore key-value pairs
await redisClient.set("user-name","taufeek");
await redisClient.set("user-role","developer");
await redisClient.set("user-status","active");

// retreiving values from redis
const name = await redisClient.get("user-name");
const role = await redisClient.get("user-role");
const status = await redisClient.get("user-status");

console.log(`user-name: ${name}`);
console.log(`user-role: ${role}`);
console.log(`user-status: ${status}`);

//check wheter key exists or not
console.log("user-name exists: ", await redisClient.exists("user-name"));
console.log("user-role exists: ", await redisClient.exists("user-role"));
console.log("user-status exists: ", await redisClient.exists("user-status"));

console.log("name key type", await redisClient.type("user-name"));

await redisClient.quit();