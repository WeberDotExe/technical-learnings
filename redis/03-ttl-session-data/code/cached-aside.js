import 'dotenv/config';
import {createClient} from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL,
});

redisClient.on("error",(error)=>{
    console.error("Redis client error:",error);
})

await redisClient.connect();

console.log("REdis client connected successfully");

//Mongodb simulation
const getScenarioFromDB = async (scenarioId)=>{
    console.log("Fetching scenario from DB");
    return {id:scenarioId, prompt:"You are negotiating a salary with a company"};
};

//cached aside function
const getScenario = async (scenarioId)=>{
    const cachedKey = `scenario:${scenarioId}`;


// 1. check redis
const cachedScenario = await redisClient.get(cachedKey);

if(cachedScenario){
    console.log("cached hit");
    return JSON.parse(cachedScenario);
}

// 2. cache miss, fetch from DB
console.log("cached miss");
const scenario = await getScenarioFromDB(scenarioId);

// 3. store in redis with TTL of 60 seconds
await redisClient.set(cachedKey,JSON.stringify(scenario),{
    EX:60,
})
return scenario;
}

// first request
console.log('\n---first request---')

const firstScenario = await getScenario("124");
console.log("scenario:",firstScenario);

//second request
console.log('\n---second request---')
const secondScenario = await getScenario("124");
console.log("scenario:",secondScenario);

await redisClient.quit();