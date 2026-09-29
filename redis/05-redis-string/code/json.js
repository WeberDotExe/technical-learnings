import "dotenv/config";
import {createClient} from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL,
})

redisClient.on("error",(error)=>{
    console.error("Redis Client Error",error)
});

await redisClient.connect();

console.log("Redis connected successfully ");

//user data

const user = {
    id:42,
    name:"Taufeek",
    role:"developer",
};

// convert user object to json string
const userjson = JSON.stringify(user);

//store json in redis
await redisClient.set("user:42",userjson);

//get json string from redis
const storedUser = await redisClient.get("user:42");

console.log("\nstored Values")
console.log(storedUser);

//convert json string to object
const parsedUser = JSON.parse(storedUser);

console.log("\nPArsed user")
console.log(parsedUser);

console.log('\nuser name:',parsedUser.name);
console.log("user role:",parsedUser.role);

//practise session
const practise = {
    status:"active",
    topic:"interview",
    mode:"text",
}

await redisClient.set("practise:42",JSON.stringify(practise));

const storedPractise = await redisClient.get("practise:42");
const parsedpractise = JSON.parse(storedPractise);

console.log("\npractise sessions ");
console.log(parsedpractise);

await redisClient.quit();