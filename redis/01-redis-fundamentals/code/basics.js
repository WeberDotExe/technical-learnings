import redisClient from "./connection.js";

await redisClient.connect();

console.log("Redis client connected");

// Store and retrieve a String
await redisClient.set("user:42:name", "Taufeek Chaudhary");

const name = await redisClient.get("user:42:name");
console.log("Name from Redis:", name);

// Store temporary data with TTL
await redisClient.set("practice-session:demo", "active", {
  EX: 60,
});

const sessionTTL = await redisClient.ttl("practice-session:demo");
console.log("Session TTL:", sessionTTL);

// Increment a counter
const loginCount = await redisClient.incr("user:42:login-count");
console.log("Login count:", loginCount);

// Increment another counter
const aiRequestCount = await redisClient.incr("user:42:ai-requests");
console.log("AI request count:", aiRequestCount);

await redisClient.quit();