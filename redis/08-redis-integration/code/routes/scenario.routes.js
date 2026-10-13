import {Router} from 'express';
import {getAllScenarios,getScenarioById} from '../services/scenario.service.js';

const router = Router();

router.get('/',async(req,res)=>{
    try{
        const scenarios = await getAllScenarios();

        res.status(200).json({
            success:true,
            count:scenarios.length,
            data:scenarios
        })
    }catch(error){
        console.error("error fetching scenarios",error.message);
        res.status(500).json({
            success:false,
            message:"failed to fetch scenarios"
        });
    }
});

router.get('/:id',async(req,res)=>{
    try{
        const scenario = await getScenarioById(req.params.id);
        if(!scenario){
            return res.status(404).json({
                success:false,
                message:"scenario not found"
            });
            
        }
        return res.status(200).json({
            success:true,
            data:scenario
        })
    }catch(error){
        console.error('failed to fetch scenario',error.message);
        res.status(500).json({
            success:false,
            message:"failed to fetch scenarios"
        })
    }
})

export default router;