import "dotenv/config";
import {createClient} from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL
});

redisClient.on("error",(error)=>{
    console.error("Redis client error",error)
});

await redisClient.connect();

console.log("redis client connected");

// clear stale keys from previous runs so the hash is created consistently
await redisClient.del("user:42", "usser:42");

//created a hash user

await redisClient.hSet("user:42",{
    name:"taufeek",
    role:"developer",
    status:"active"
})

console.log("\nHash created successfully\n");

//get individual field 
const name  = await redisClient.hGet("user:42","name");
const role = await redisClient.hGet("user:42","role");

console.log("\nname",name)
console.log("role",role)

// get multiple fields
const userDetails = await redisClient.hmGet("user:42",["name","role","status"]);
console.log("\nSelected fields",userDetails);

//get all fields

const user = await redisClient.hGetAll("user:42");
console.log("\n all fields",user);

//update a field 
await redisClient.hSet("user:42","status","inactive");

console.log("\nupdated status",await redisClient.hGet("user:42","status"));

//check field existense
const hasrole = await redisClient.hExists("user:42","role");
console.log("\nrole field exists",hasrole);

//delete a field
await redisClient.hDel("user:42","status");
console.log("status after deletion",await redisClient.hGet("user:42","status"));

//final hash
console.log("\nfinal hash",await redisClient.hGetAll("user:42"));

await redisClient.quit();

