import express from 'express';
import "dotenv/config";
import redisClient from './config/redis.js';
import scenarioRoutes from './routes/scenario.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/scenarios',scenarioRoutes);

app.get('/health', async(req,res)=>{
    try{
        const redisStatus = await redisClient.ping();

        res.status(200).json({
            success:true,
            message:"service is up and running",
            redis:redisStatus
        })
    }catch(error){
        res.status(503).json({
            sucess: false,
            message: "Service Unavailable"
        });
    }
});


async function startServer(){
    try{
        await redisClient.connect();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}`);
        })
    }catch(error){
        console.error("failed to start application",error.message);
        process.exit(1);
    }
}

startServer();