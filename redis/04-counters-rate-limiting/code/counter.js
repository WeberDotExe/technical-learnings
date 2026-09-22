import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL
});

redisClient.on("error",(error)=>{
    console.error("REdis client error",error)
});

await redisClient.connect();

console.log("REdis client connected successfully");

// login attempts
const loginkey = "user:42:login-attemps";

const firstAttempt = await redisClient.incr(loginkey);
console.log("\nfirst attempt",firstAttempt);

const secondAttempt = await redisClient.incr(loginkey);
console.log("\nsecond attempt",secondAttempt);

//incr by n number
const updateAttemps = await redisClient.incrBy(loginkey,6);
console.log("\nupadted attemps after incrby",updateAttemps);

//ai request counter
const aiRequestkey = "user:42:ai-request-counter";

const aiRequestCount = await redisClient.incr(aiRequestkey);
console.log("\nAI request count",aiRequestCount);

const moreaiRequest = await redisClient.incrBy(aiRequestkey,10);
console.log("\nai request after a incrby",moreaiRequest);

console.log("\nfinal login attemps",await redisClient.get(loginkey));

console.log("\nfinal ai request count",await redisClient.get(aiRequestkey));

await redisClient.quit();