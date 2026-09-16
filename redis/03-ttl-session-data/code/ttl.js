import "dotenv/config";
import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

await redisClient.connect();

console.log("Redis client connected");

// Store a temporary key
await redisClient.set("practice:ttl-test", "active");

// Check the key
console.log(
  "Initial value:",
  await redisClient.get("practice:ttl-test")
);

// Set expiration to 30 seconds
await redisClient.expire("practice:ttl-test", 30);

// Check TTL
console.log(
  "TTL after EXPIRE:",
  await redisClient.ttl("practice:ttl-test")
);

// Update the value
await redisClient.set("practice:ttl-test", "in-progress");

// Check TTL after updating
console.log(
  "Value after update:",
  await redisClient.get("practice:ttl-test")
);

console.log(
  "TTL after SET:",
  await redisClient.ttl("practice:ttl-test")
);

// Set value and TTL together
await redisClient.set("practice:ttl-test", "active", {
  EX: 30,
});

console.log(
  "TTL after SET with EX:",
  await redisClient.ttl("practice:ttl-test")
);

await redisClient.quit();