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
    console.log("a client is connected",socket.id);

    socket.on("hello",(data)=>{
        console.log("hello event recieved");
        console.log("from socket",socket.id);
        console.log("payload",data);
    })

    socket.on("disconnect",(reason)=>{
        console.log("a client disconnected",socket.id,reason);
    });
});

const PORT = 3000;

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})