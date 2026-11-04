
# Chapter 3 – Broadcasting and Rooms

## 1. Broadcasting in Socket.IO

Broadcasting allows the server to send an event to multiple connected clients without communicating with each client individually.

Socket.IO provides different methods depending on which clients should receive the event.

### io.emit()

Sends an event to every connected client, including the client that triggered the event.

```js
io.emit("new-message", {
  message: "Hello everyone!",
});
```

### socket.broadcast.emit()

Sends an event to every connected client except the socket that triggered the event.

```js
socket.broadcast.emit("new-message", {
  message: "Hello everyone except me!",
});
```

### Difference

- `io.emit()` includes the sender.
- `socket.broadcast.emit()` excludes the sender.

I tested both methods using multiple browser tabs and observed how the receiving clients changed depending on the method used.

---

## 2. Understanding Socket.IO Rooms

Rooms allow us to group connected sockets so that we can send messages to a specific group instead of broadcasting them to every connected client.

For example, imagine a chat application with different conversations:

- interview-101
- general-chat
- developers

A user connected to one room does not automatically receive messages sent to another room.

Rooms are managed by the Socket.IO server.

### Joining a Room

We can use `socket.join()` to add a connected socket to a room.

```js
socket.on("join-room", async (roomName) => {
  await socket.join(roomName);

  socket.emit("room-joined", roomName);
});
```

After joining, the socket becomes a member of that room and can receive events sent to it.

### Sending Messages to a Room

We can use `io.to(room).emit()` to send an event to all sockets in a particular room.

```js
io.to("interview-101").emit("room-message-received", {
  message: "Welcome to the interview room!",
});
```

Only sockets that have joined `interview-101` receive this event.

The sender also receives the message if it belongs to that room.

### Sending Messages to a Room Except the Sender

Socket.IO also provides `socket.to(room).emit()`.

```js
socket.to("interview-101").emit("room-message-received", {
  message: "Hello room!",
});
```

This sends the event to other sockets in the specified room, excluding the sender.

### Difference

- `io.to(room).emit()` includes the sender if they belong to the room.
- `socket.to(room).emit()` excludes the sender.

---

## 3. Checking Room Membership

Socket.IO provides `socket.rooms`, which contains the rooms a socket currently belongs to.

Every connected socket automatically belongs to a private room named after its socket ID.

We can check whether a socket belongs to a particular room using:

```js
if (socket.rooms.has("interview-101")) {
  console.log("Socket belongs to this room");
}
```

This is useful when we want to prevent clients from sending messages to rooms they haven't joined.

In my implementation, I checked room membership before allowing a client to send a room message.

---

## 4. Leaving a Room

A socket can leave a room using `socket.leave()`.

```js
socket.on("leave-room", async (roomName) => {
  await socket.leave(roomName);

  socket.emit("room-left", roomName);
});
```

After leaving a room, the socket will no longer receive messages sent to that room.

Socket.IO also automatically removes a socket from its rooms when it disconnects.

---

## 5. Practical Implementation

I created a room-based messaging system using Express.js and Socket.IO.

The application allows multiple browser tabs to connect to the same server and communicate through specific rooms.

### Features Implemented

1. Connect multiple browser clients.
2. Join a room using a room name.
3. Send messages to everyone in a room.
4. Display received messages in the browser.
5. Leave a room.
6. Prevent sending messages to rooms the socket hasn't joined.
7. Handle invalid room names and message payloads.

### Important Server Events

| Event | Purpose |
|---|---|
| `connection` | Handles a new client connection |
| `join-room` | Adds a socket to a room |
| `room-joined` | Confirms successful room joining |
| `room-message` | Receives a room message from a client |
| `room-message-received` | Delivers a message to room members |
| `leave-room` | Removes a socket from a room |
| `room-left` | Confirms that the socket left |
| `room-error` | Sends room-related errors |
| `disconnect` | Handles client disconnection |

---

## 6. Testing

I tested the implementation using multiple browser tabs.

### Test 1: Broadcasting to Everyone

Used `io.emit()` and verified that both the sender and other connected clients received the message.

### Test 2: Broadcasting Except the Sender

Used `socket.broadcast.emit()` and verified that the sender did not receive its own broadcast event.

### Test 3: Joining the Same Room

Joined two browser tabs to `interview-101` and sent a message.

Both tabs received the message.

### Test 4: Different Rooms

Joined Tab 1 to `interview-101` and Tab 2 to `general-chat`.

Messages sent to one room were not received by clients in the other room.

### Test 5: Leaving a Room

Left a room and verified that the client no longer received messages sent to that room.

### Test 6: Room Membership Validation

Attempted to send a message to a room without joining it and verified that the server returned an error.

---

## 7. Important Takeaways

- Broadcasting is useful when an event needs to reach multiple connected clients.
- Rooms help organize clients into separate communication groups.
- A socket can join multiple rooms.
- Every socket automatically has a private room identified by its socket ID.
- `io.to(room).emit()` includes the sender if it belongs to the room.
- `socket.to(room).emit()` excludes the sender.
- `socket.rooms` can be used to check room membership.
- Socket.IO automatically removes disconnected sockets from their rooms.

### Production Consideration

In this learning project, clients can provide room names directly.

In a real application, room access should be controlled by the server. A client should not be allowed to join any room simply by knowing its name.

The server should authenticate the user and verify whether they are authorized to access the requested conversation or room.

---

## 8. What's Next?

The next chapter focuses on building a real-time chat application using React, Node.js, Express.js, and Socket.IO.

I'll use the concepts learned here to build a more complete application with a proper frontend and backend structure.
