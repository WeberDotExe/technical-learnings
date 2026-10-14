import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer)

app.get('/',(req,res)=>{
    res.send("socket.io server is running!")
})

io.on("connection",(socket)=>{
    console.log("a client is connected",socket.id);

    socket.on("disconnect",(reason)=>{
        console.log("a client disconnected",socket.id,reason);
    });
});

const PORT = 3000;

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
})