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

// Check session before expiration
console.log(
  "\nSession before expiration:",
  await redisClient.get(sessionkey)
);

console.log(
  "Current TTL:",
  await redisClient.ttl(sessionkey)
);

// Wait for the session to expire
console.log("\nWaiting for session to expire...");

await new Promise((resolve) => setTimeout(resolve, 31000));

// Check session after expiration
console.log(
  "\nSession after expiration:",
  await redisClient.get(sessionkey)
);

console.log(
  "TTL after expiration:",
  await redisClient.ttl(sessionkey)
);

await redisClient.quit();
