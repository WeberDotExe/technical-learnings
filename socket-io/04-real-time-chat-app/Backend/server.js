import express from 'express';
import {createServer} from 'node:http';
import {Server} from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(cors({origin: process.env.CLIENT_URL}));
app.use(express.json());

const io = new Server(httpServer, {
    cors:{origin: process.env.CLIENT_URL}
})

const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
  res.send("chat server is running")
})

io.on("connection",(socket)=>{
  console.log("client connected",socket.id);

  socket.on("join-chat",(username)=>{
    if(typeof username !== "string"){
      socket.emit("chat-error","invalid username")
      return;
    }

    const cleanUsername = username.trim();

    if(!cleanUsername || cleanUsername.length > 20){
      socket.emit("chat-error","username must be between 1 and 20 characters")
      return;
    }

    socket.data.username = cleanUsername;

    socket.emit("chat-joined",{
      username:cleanUsername,
      socketId:socket.id
    });
    console.log(`${cleanUsername} joined the chat with socket id ${socket.id}`);
  });

  socket.on("join-room",async(roomName)=>{
    if(!socket.data.username){
      socket.emit("chat-error","join the chat before joining the room")
      return;
    }

    if(typeof roomName !== "string"){
      socket.emit("chat-error",'invalid room name')
      return;
    }

    const cleanRoom = roomName.trim();

    if(!/^[a-zA-Z0-9_-]{2,30}$/.test(cleanRoom)){
      socket.emit('chat-error','room name must be 2-30 characters long and can only contain letters, numbers, underscores, and hyphens')
      return;
    }

    if(socket.data.room === cleanRoom){
      socket.emit("room-joined",cleanRoom);
      return;
    }

    if(socket.data.room){
      await socket.leave(socket.data.room);
    }

    await socket.join(cleanRoom);

    socket.emit("room-joined",cleanRoom);

    console.log(`${socket.data.username} joined room ${cleanRoom}`);

  });

  socket.on("leave-room",async()=>{
    const currentRoom = socket.data.room;

    if(!currentRoom){
      socket.emit("chat-error","you are not in any room");
      return;
    }

    await socket.leave(!currentRoom)

    delete socket.data.room;

    socket.emit("room-left",currentRoom);

    console.log(`${socket.data.username} left room ${currentRoom}`);

  });

  socket.on("send-message",(data)=>{
    const username = socket.data.username;
    const room = socket.data.room;

    if(!username){
      socket.emit("chat-error","join the chat first")
      return;
    }

    if(!room || !socket.room.has(room)){
      socket.emit("chat-error","join a room before sending a message");
      return;
    }

    if(!data || typeof data.message !== "string"){
      socket.emit("chat-error","invalid message");
      return;
    }

    const cleanMessage = data.message.trim();

    if(!cleanMessage || cleanMessage.length > 500){
      socket.emit("chat-error","message must be between 1 and 500 characters");
      return;
    }
    const chatMessage = {
      id: crypto.randomUUID(),
      username,
      senderId:socket.id,
      room,
      message:cleanMessage,
      timestamp: new Date().toISOString()
    };
    io.to(room).emit("receive-message",chatMessage);
  });

  socket.on("disconnect",(reason)=>{
    console.log("client disconnect",socket.id);
    console.log("Reason",reason);
  });

});

httpServer.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`);
});