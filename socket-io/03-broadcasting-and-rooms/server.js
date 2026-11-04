
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("--------------------------------");
  console.log("Client connected:", socket.id);

  socket.on("join-room", async (roomName) => {
    if (typeof roomName !== "string") {
      socket.emit("room-error", "Room name must be a string.");
      return;
    }

    const room = roomName.trim();

    if (!room) {
      socket.emit("room-error", "Please enter a room name.");
      return;
    }

    await socket.join(room);

    console.log(`${socket.id} joined room: ${room}`);
    socket.emit("room-joined", room);
  });

  socket.on("room-message", (data) => {
    if (
      !data ||
      typeof data.room !== "string" ||
      typeof data.message !== "string"
    ) {
      socket.emit("room-error", "Invalid message payload.");
      return;
    }

    const cleanRoom = data.room.trim();
    const cleanMessage = data.message.trim();

    if (!cleanRoom || !cleanMessage) {
      socket.emit("room-error", "Room and message are required.");
      return;
    }

    if (!socket.rooms.has(cleanRoom)) {
      socket.emit("room-error", `You haven't joined room: ${cleanRoom}`);
      return;
    }

    io.to(cleanRoom).emit("room-message-received", {
      room: cleanRoom,
      message: cleanMessage,
      senderId: socket.id,
    });
  });

  socket.on("leave-room", async (roomName) => {
    if (typeof roomName !== "string") {
      socket.emit("room-error", "Invalid room name.");
      return;
    }

    const room = roomName.trim();

    if (!room || !socket.rooms.has(room)) {
      socket.emit("room-error", "You're not in that room.");
      return;
    }

    await socket.leave(room);

    console.log(`${socket.id} left room: ${room}`);
    socket.emit("room-left", room);
  });

  socket.on("disconnect", (reason) => {
    console.log("Client disconnected:", socket.id);
    console.log("Reason:", reason);
  });
});

const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
