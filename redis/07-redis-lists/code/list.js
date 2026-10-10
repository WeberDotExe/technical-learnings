import 'dotenv/config';
import {createClient}  from 'redis';

const redisClient = createClient({
    url:process.env.REDIS_URL
});

async function runListExamples(){
    const key = "learning:node:tasks";

    try{
        await redisClient.connect();
        await redisClient.del(key);

        await redisClient.rPush(key,[
            "learning redis list",
            "practising node js",
            "writing chapter notes"
        ])

        const tasks = await redisClient.lRange(key, 0, -1);
        console.log("all tasks",tasks);

        const firstTask = await redisClient.lIndex(key,0);
        console.log("first task",firstTask);

        const totalTask = await redisClient.lLen(key);
        console.log("total task",totalTask);

        await redisClient.lPush(key,"Review redis basics");
        console.log("after LPush",await redisClient.lRange(key,0,-1));

        const removeTask = await redisClient.lPop(key);
        console.log("removed task",removeTask);

        await redisClient.lTrim(key,0,1);
        console.log("After Ltrim ",await redisClient.lRange(key,0,-1));

    }catch(error){
        console.error("Error connecting to Redis:", error);
    }finally{
        if(redisClient.isOpen){
            await redisClient.quit();
        }
    }
}

runListExamples();