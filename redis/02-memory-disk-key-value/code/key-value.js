import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({url:process.env.REDIS_URL});

redisClient.on("error",(error)=>{
    console.error("Redis Client Error",error);
})

await redisClient.connect();

console.log("redis client connected successfully");

// here we will sTore key-value pairs
await redisClient.set("user:42:name","taufeek");
await redisClient.set("user:42:role","developer");
await redisClient.set("user:42:status","active");

// retreiving values from redis
const name = await redisClient.get("user:42:name");
const role = await redisClient.get("user:42:role");
const status = await redisClient.get("user:42:status");

console.log("\nUser 42")
console.log(`Name: ${name}`);
console.log(`Role: ${role}`);
console.log(`Status: ${status}`);

// Practise data
await redisClient.set("practise:42:status","active");
await redisClient.set("practise:42:topic","interview");
await redisClient.set("practise:42:mode","text");

const practiseStatus = await redisClient.get("practise:42:status");
const practiseTopic = await redisClient.get("practise:42:topic");
const practiseMode = await redisClient.get("practise:42:mode");

console.log("\nPractise 42")
console.log(`Status: ${practiseStatus}`);
console.log(`Topic: ${practiseTopic}`);
console.log(`Mode: ${practiseMode}`);


//check wheter key exists or not
console.log('\nUser name key exists:', await redisClient.exists("user:42:name"));
console.log("Practise status key exists:", await redisClient.exists("practise:42:status"));

const missingKey = await redisClient.get("user:999:name");
console.log("Missing key:", missingKey);

const missingExists = await redisClient.exists("user:999:name");
console.log("Missing key exists:", missingExists);


console.log("name key type", await redisClient.type("user:42:name"));

await redisClient.quit();