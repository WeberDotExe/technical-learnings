# Socket.IO Fundamentals

## About

This is where I started learning Socket.IO by building a small project and testing how real-time communication works between a server and multiple browser tabs.

## What I Learned

- Setting up Socket.IO with Express and Node.js.
- Connecting clients to the server and understanding socket IDs.
- Listening for events and sending data between the client and server.
- Sending a response to a specific client.
- Broadcasting messages to other clients using `socket.broadcast.emit()`.
- Sending messages to all connected clients using `io.emit()`.

## Built With

- Node.js
- Express
- Socket.IO
- HTML and JavaScript

## Running the Project

Make sure Node.js is installed, then open a terminal in this folder and run:

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser. Open the same URL in two tabs to test how events and broadcasts behave between connected clients.

## What I Practised

I tested the project with multiple browser tabs to see how each client connects independently. I also tried different ways of sending messages and checked which tabs received them.

This helped me understand the difference between sending a response to one client, broadcasting to other clients, and sending an event to everyone.

## Next Step

Move on to event handling and the Socket.IO connection lifecycle.