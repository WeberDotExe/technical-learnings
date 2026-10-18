import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer)

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname,'public')));

io.on("connection",(socket)=>{
    console.log("--------------------------------");
    console.log("client connected");
    console.log("socket ID:",socket.id);

   socket.on('message-to-all',(message)=>{
    console.log("message to all ",message);
    
    io.emit("new-message",{
        message,
    senderId: socket.id,
    type: "all" 
})
})

    socket.on("message-to-others",(message)=>{
        console.log("message to others",message)

        socket.broadcast.emit("new-message",{
            message,
            SenderID:socket.id,
            type:"others",
        });
    });
   
    socket.on("disconnect",(reason)=>{
        console.log("client disconnected")
        console.log("Socket ID:",socket.id);
        console.log("reason:",reason);
    })
})

const PORT = 3000;

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})