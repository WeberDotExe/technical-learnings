import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

const io = new Server(httpServer, {
    cors:{origin: process.env.CLIENT_URL}
})

io.on("connection",(socket)=>{
    
    console.log("client connected",socket.id);

    socket.on("send-message",(data)=>{
        console.log("received message",data);

        io.emit("receive-message",{
            id:Date.now(),
            message:data.message,
            senderId:socket.id,
            timestamp:new Date().toISOString()

        });

    });

    socket.on("disconnect",(reason)=>{
        console.log("client disconnected",socket.id);
        console.log('reason',reason)
    });
});

app.get('/',(req,res)=>{
    res.send("chat server is running");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});