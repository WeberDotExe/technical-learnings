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


io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-chat", (username) => {
    if (typeof username !== "string") {
      socket.emit("chat-error", "Username must be a string.");
      return;
    }

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      socket.emit("chat-error", "Username is required.");
      return;
    }

    if (cleanUsername.length > 20) {
      socket.emit("chat-error", "Username cannot exceed 20 characters.");
      return;
    }

    socket.data.username = cleanUsername;

    console.log(`${cleanUsername} joined the chat`);

    socket.emit("chat-joined", {
      username: cleanUsername,
      socketId: socket.id,
    });
  });

  socket.on("send-message", (data) => {
    const username = socket.data.username;

    if (!username) {
      socket.emit("chat-error", "Join the chat before sending messages.");
      return;
    }

    if (
      !data ||
      typeof data.message !== "string" ||
      !data.message.trim()
    ) {
      socket.emit("chat-error", "Please enter a valid message.");
      return;
    }

    const cleanMessage = data.message.trim();

    if (cleanMessage.length > 500) {
      socket.emit("chat-error", "Message cannot exceed 500 characters.");
      return;
    }

    const chatMessage = {
      id: crypto.randomUUID(),
      username,
      senderId: socket.id,
      message: cleanMessage,
      timestamp: new Date().toISOString(),
    };

    io.emit("receive-message", chatMessage);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id);
    console.log("Reason:", reason);
  });
});


app.get('/',(req,res)=>{
    res.send("chat server is running");
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});