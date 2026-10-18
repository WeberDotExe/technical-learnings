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
    console.log("transport:",socket.conn.transport.name);

    socket.conn.on("upgrade",(transport)=>{
        console.log("transport upgraded to :",transport.name);
    });

    socket.on('save-answer',(data,acknowledge)=>{
        console.log("answer recieved:",data.answer);
        console.log("from socket:",socket.id);


        if(typeof acknowledge === "function"){
            acknowledge({
                success:true,
                message:"answer recieved by the server",
                recievedAnswer:data.answer,
            });
        }
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