import redisClient from "../config/redis.js";

const CACHE_TTL_SECONDS = 60;

const scenarios = [
  {
    id: "scenario-1",
    title: "Job Interview",
    category: "career",
    difficulty: "medium",
  },
  {
    id: "scenario-2",
    title: "Salary Negotiation",
    category: "career",
    difficulty: "hard",
  },
  {
    id: "scenario-3",
    title: "Handling an Angry Customer",
    category: "customer-service",
    difficulty: "medium",
  },
];


async function getCachedData(key) {
  const cachedData = await redisClient.get(key);

  if (cachedData === null) {
    console.log(`CACHE MISS: ${key}`);
    return null;
  }

  console.log(`CACHE HIT: ${key}`);
  return JSON.parse(cachedData);
}

async function setCachedData(key, data) {
  await redisClient.set(key, JSON.stringify(data), {
    EX: CACHE_TTL_SECONDS,
  });
}

export async function getAllScenarios() {
    const cachedKey = "scenarios:all";

    const cachedData = await getCachedData(cachedKey)

    if(cachedData !== null){
        return cachedData;
    }

  console.log("Fetching scenarios from simulated database...");

    const data = scenarios;

    await setCachedData(cachedKey,data);
  return data;
}

export async function getScenarioById(id) {
    const cachedKey = `scenario:${id}`;
    const cachedData = await getCachedData(cachedKey);

    if(cachedData !== null){
        return cachedData;
    }

  console.log(`Fetching scenario ${id} from simulated database...`);

  const scenario = scenarios.find((item)=>item.id === id) ?? null;

    if(scenario === null){
        return null;
    }

  await setCachedData(cachedKey,scenario);
    return scenario;
}
