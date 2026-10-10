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

// Create a Hash
await redisClient.hSet("user:42", {
  name: "Taufique",
  role: "developer",
  loginAttempts: "0",
  aiRequests: "0",
});

console.log("\nInitial user:", await redisClient.hGetAll("user:42"));

// Update one field
await redisClient.hSet("user:42", "role", "backend-developer");

console.log("\nUpdated role:", await redisClient.hGet("user:42", "role"));

// Increment numeric fields
await redisClient.hIncrBy("user:42", "loginAttempts", 1);
await redisClient.hIncrBy("user:42", "loginAttempts", 1);
await redisClient.hIncrBy("user:42", "aiRequests", 3);

console.log("\nLogin attempts:", await redisClient.hGet("user:42", "loginAttempts"));
console.log("AI requests:", await redisClient.hGet("user:42", "aiRequests"));

// Check whether a field exists
console.log(
  "\nHas email field:",
  await redisClient.hExists("user:42", "email")
);

// Delete one field
await redisClient.hDel("user:42", "role");

console.log(
  "Has role field after deletion:",
  await redisClient.hExists("user:42", "role")
);

// Inspect the final Hash
console.log("\nFinal user:", await redisClient.hGetAll("user:42"));

await redisClient.quit();