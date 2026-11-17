
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "node:crypto";

dotenv.config();

const app = express();
const httpServer = createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
  })
);

app.use(express.json());

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Chat server is running!");
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  // Join the chat with a username
  socket.on("join-chat", (username) => {
    if (typeof username !== "string") {
      socket.emit("chat-error", "Invalid username.");
      return;
    }

    const cleanUsername = username.trim();

    if (!cleanUsername || cleanUsername.length > 20) {
      socket.emit("chat-error", "Username must be between 1 and 20 characters.");
      return;
    }

    socket.data.username = cleanUsername;

    socket.emit("chat-joined", {
      username: cleanUsername,
      socketId: socket.id,
    });

    console.log(`${cleanUsername} joined the chat.`);
  });

  // Join a room
  socket.on("join-room", async (roomName) => {
    if (!socket.data.username) {
      socket.emit("chat-error", "Join the chat before joining a room.");
      return;
    }

    if (typeof roomName !== "string") {
      socket.emit("chat-error", "Invalid room name.");
      return;
    }

    const cleanRoom = roomName.trim();

    if (
      !/^[a-zA-Z0-9_-]{2,30}$/.test(cleanRoom)
    ) {
      socket.emit(
        "chat-error",
        "Room name must be 2–30 characters and contain only letters, numbers, hyphens, or underscores."
      );
      return;
    }

    // Avoid joining the same room again
    if (socket.data.room === cleanRoom) {
      socket.emit("room-joined", cleanRoom);
      return;
    }

    // Leave the previous room if one exists
    if (socket.data.room) {
      await socket.leave(socket.data.room);
    }

    // Join the new room
    await socket.join(cleanRoom);

    socket.data.room = cleanRoom;

    socket.emit("room-joined", cleanRoom);

    console.log(`${socket.data.username} joined room: ${cleanRoom}`);
  });

  // Leave the current room
  socket.on("leave-room", async () => {
    const currentRoom = socket.data.room;

    if (!currentRoom) {
      socket.emit("chat-error", "You are not in any room.");
      return;
    }

    await socket.leave(currentRoom);

    delete socket.data.room;

    socket.emit("room-left", currentRoom);

    console.log(`${socket.data.username} left room: ${currentRoom}`);
  });

  // Send a message to the current room only
  socket.on("send-message", (data) => {
    const username = socket.data.username;
    const room = socket.data.room;

    if (!username) {
      socket.emit("chat-error", "Join the chat first.");
      return;
    }

    if (!room || !socket.rooms.has(room)) {
      socket.emit("chat-error", "Join a room before sending messages.");
      return;
    }

    if (
      !data ||
      typeof data.message !== "string"
    ) {
      socket.emit("chat-error", "Invalid message.");
      return;
    }

    const cleanMessage = data.message.trim();

    if (!cleanMessage || cleanMessage.length > 500) {
      socket.emit(
        "chat-error",
        "Message must be between 1 and 500 characters."
      );
      return;
    }

    const chatMessage = {
      id: crypto.randomUUID(),
      username,
      senderId: socket.id,
      room,
      message: cleanMessage,
      timestamp: new Date().toISOString(),
    };

    // Send only to members of this room
    io.to(room).emit("receive-message", chatMessage);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id);
    console.log("Reason:", reason);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
