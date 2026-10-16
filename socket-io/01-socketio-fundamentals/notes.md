# Socket.IO Fundamentals — Notes

## 1. What I Was Trying to Learn

I wanted to understand how a browser and a server communicate in real time using Socket.IO. Instead of starting with a complete chat application, I built a small project and tested each concept separately.

I used two browser tabs to see how multiple clients connect to the same server and how messages behave depending on the method used to send them.

## 2. Project Setup

I created a Node.js project and installed Express and Socket.IO.

```bash
npm init -y
npm install express socket.io
```

In `package.json`, I added `"type": "module"` to use ES module imports and configured the start script:

```json
{
  "type": "module",
  "scripts": {
    "start": "node server.js"
  }
}
```

The important part of the setup is that Socket.IO needs to work with the HTTP server. I created the HTTP server using Node.js and attached Socket.IO to it.

```js
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
```

Here, Express handles the web application, `httpServer` handles HTTP connections, and `io` manages Socket.IO communication.

I used Express static middleware to serve the HTML file from the `public` folder.

## 3. Starting the Server

I configured the server to listen on port 3000.

```js
const PORT = 3000;

httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
```

I started it with:

```bash
npm start
```

I also added a connection handler to check when a browser connects to the server.

```js
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
});
```

Whenever a new client connects, Socket.IO gives that connection a socket ID.

### What I observed

When I opened the application in two browser tabs, both connected successfully, but each tab had a different socket ID.

This helped me understand that each tab creates its own Socket.IO connection. A socket ID identifies a particular connection; it does not automatically identify the actual person using the application.

## 4. Handling Connections and Disconnections

I added a listener for the `disconnect` event.

```js
socket.on("disconnect", (reason) => {
  console.log("Client disconnected:", socket.id, reason);
});
```

When I closed one browser tab, the server logged that the corresponding client had disconnected. The other tab remained connected.

This showed me that disconnecting one client does not automatically disconnect the others.

The `reason` value helps explain why that particular connection disconnected.

## 5. Understanding Events

Events are how the client and server communicate through Socket.IO. I can choose an event name and send data along with it.

For example, I created a button that sends a `hello` event from the browser.

```js
socket.emit("hello", {
  message: "Hello from the browser!",
  sentAt: new Date().toISOString()
});
```

On the server, I listened for that event.

```js
socket.on("hello", (data) => {
  console.log("Hello event received!");
  console.log("From socket:", socket.id);
  console.log("Payload:", data);
});
```

The browser sends the event with `socket.emit()`, and the server receives it using `socket.on()`.

The `data` parameter contains the payload sent with the event. In this example, it contains a message and a timestamp.

### What I learned

- `socket.emit()` sends an event.
- `socket.on()` listens for an event.
- The event name used to send data must match the event name used by the listener.
- The payload can contain useful data that the receiver needs to process.

## 6. Sending a Response to the Same Client

After receiving the `hello` event, I made the server respond to the client that sent it.

```js
socket.on("hello", (data) => {
  socket.emit("hello-response", {
    message: "Hello from the server!",
    receivedMessage: data.message
  });
});
```

The browser listens for the response:

```js
socket.on("hello-response", (data) => {
  console.log("Server replied:", data.message);
});
```

I tested this in two tabs. When I clicked the button in Tab 1, the response appeared in Tab 1. Tab 2 did not receive that response.

This helped me understand an important detail: `socket.emit()` behaves differently depending on which side uses it.

- In the browser, `socket.emit()` sends an event to the server.
- On the server, `socket.emit()` sends an event to that particular client connection.

The same method name is used on both sides, but the destination depends on where the socket is being used.

## 7. Broadcasting to Other Clients

Next, I wanted to send a message to other connected clients without sending it back to the client that initiated the broadcast.

I used:

```js
socket.broadcast.emit("broadcast-message", {
  message: "A broadcast was sent!",
  senderId: socket.id
});
```

The server listens for the event from the sender, then broadcasts a new event to all other connected clients.

The browser listens for the broadcast:

```js
socket.on("broadcast-message", (data) => {
  console.log(data.message);
  console.log("Sent by:", data.senderId);
});
```

### What I tested

1. I opened the application in two browser tabs.
2. I clicked the broadcast button in Tab 1.
3. Tab 2 received the broadcast, but Tab 1 did not receive that broadcast event.
4. I repeated the test from Tab 2, and Tab 1 received its broadcast.

I understood that `socket.broadcast.emit()` excludes the socket that initiated the broadcast.

This is useful when I want to notify other clients about an action without sending the same broadcast back to the sender.

## 8. Broadcasting to Every Connected Client

After that, I changed the server to use `io.emit()`.

```js
io.emit("broadcast-message", {
  message: "A broadcast was sent!",
  senderId: socket.id
});
```

I tested it again with two tabs. This time, both tabs received the broadcast, including the tab that triggered it.

### Difference between the two methods

| Method | Who receives the event? |
|---|---|
| `socket.emit()` on the server | The specific client associated with that socket |
| `socket.broadcast.emit()` | All other connected clients, excluding the sender |
| `io.emit()` | All connected clients, including the sender |

These methods solve different communication needs, so choosing the right one depends on which clients need to receive the event.

## 9. How the Event Flow Works

For the broadcast experiment, the flow looks like this:

1. A user clicks the broadcast button in the browser.
2. The browser emits the `broadcast-message` event to the server.
3. The server receives the event and reads the payload.
4. The server emits a broadcast event using either `socket.broadcast.emit()` or `io.emit()`.
5. Each client included in the broadcast receives the event through its `socket.on()` listener.
6. The browser updates its interface with the received message.

The important thing is that the browser does not directly broadcast to the other browser. The server receives the original event and decides which clients should receive the next event.

## 10. Important Things I Learned

- Socket.IO can be attached to an HTTP server created with Node.js.
- Every connected client has its own socket connection and socket ID.
- Events allow the browser and server to exchange data.
- Event names must match between emitters and listeners.
- The payload carries the data sent with an event.
- Server-side `socket.emit()` targets one client.
- `socket.broadcast.emit()` excludes the sender.
- `io.emit()` includes the sender and all other connected clients.
- Multiple browser tabs are useful for testing real-time communication locally.

## 11. Common Issues to Check

If the application does not work as expected, these are the first things I would check:

- **Server does not start:** Check the terminal for errors and confirm the dependencies are installed.
- **Browser cannot connect:** Confirm the server is running and open the correct local URL.
- **Button does nothing:** Check whether the client has connected and whether the button is enabled.
- **Event is not received:** Confirm that the event names match and that the listener is registered.
- **Only one tab receives a message:** Check which emission method the server is using.
- **Old code still appears:** Save the files, refresh the browser, and restart the server if needed.

## 12. Interview Questions

### Q1. What is Socket.IO?

Socket.IO is a library for real-time, bidirectional communication between clients and servers. It provides events that allow both sides to send and receive data.

### Q2. What is a socket ID?

A socket ID identifies an individual Socket.IO connection. Different browser tabs can have different socket IDs, even when they belong to the same user.

### Q3. What is the difference between `socket.emit()` and `socket.on()`?

`socket.emit()` sends an event, while `socket.on()` registers a listener that handles an event when it is received.

### Q4. What is the difference between `socket.broadcast.emit()` and `io.emit()`?

`socket.broadcast.emit()` sends an event to all other connected clients, excluding the sender. `io.emit()` sends the event to all connected clients, including the sender.

### Q5. Why did we create an HTTP server separately?

We created an HTTP server using Node.js and attached Socket.IO to it so that the Express application and Socket.IO can work through the same server.

### Q6. Does `socket.emit()` mean the same thing on the client and server?

The method sends an event in both cases, but the destination differs. On the client, it sends an event to the server. On the server, it sends an event to the associated client.

### Q7. How did you test broadcasting locally?

I opened the application in two browser tabs, connected both to the server, and triggered broadcasts from each tab. I observed which tabs received the event when using `socket.broadcast.emit()` and `io.emit()`.

## 13. Chapter Summary

I built a small Socket.IO project to understand connections, events, payloads, server responses, and broadcasting. Testing with two browser tabs helped me see how different emission methods affect which clients receive a message.

This chapter gave me a practical foundation for building real-time features such as chat messages, live notifications, and collaborative interactions.