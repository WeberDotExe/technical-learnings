# Chapter 4 – Real-Time Chat App

## 1. Overview

In this chapter, I built a real-time chat application using React and Socket.IO.

Until now, I had practised individual Socket.IO concepts such as events, broadcasting, acknowledgements, and rooms. This project brought those concepts together into one application.

The main goal was to understand how a React frontend communicates with a Socket.IO backend and how multiple users can communicate in separate conversations.

## 2. Project Setup

I divided the project into two separate applications:

- Backend – Node.js, Express, and Socket.IO.
- Frontend – React, Vite, and socket.io-client.

The backend runs on port `5000`, while the frontend runs on port `5173`.

### Backend setup

The backend uses:

- Express to create the HTTP application.
- Node.js HTTP server to host the application.
- Socket.IO Server to handle real-time connections.
- CORS to allow requests from the frontend.
- dotenv to load environment variables.
- crypto to generate unique message IDs.

One important thing I learned is that Socket.IO attaches to the HTTP server, not directly to the Express application.

### Frontend setup

I installed `socket.io-client` and created a separate socket service.

The socket connection is configured with:

```js
import { io } from "socket.io-client";

const socket_URL = "http://localhost:5000";

export const socket = io(socket_URL, {
  autoConnect: false,
});
```

I used `autoConnect: false` because I wanted to control when the connection starts.

The connection is initiated from the React application.

## 3. Connecting React with Socket.IO

I used `useEffect` to manage the socket connection.

Inside the effect, I:

- Registered socket event listeners.
- Connected the socket.
- Handled connection and disconnection events.
- Removed the registered listeners during cleanup.
- Disconnected the socket during cleanup.

I also used React state to track:

- Connection status.
- Socket ID.
- Username.
- Active room.
- Messages.
- Input values.
- Error messages.

This helped me understand how socket events can update the React interface in real time.

## 4. Username-Based Chat Joining

Before sending messages, users need to choose a username.

The frontend emits:

```js
socket.emit("join-chat", {
  username,
});
```

The backend validates the username and stores it inside:

```js
socket.data.username
```

After successful registration, the server sends a `chat-joined` event back to that client.

The frontend listens for this event and updates the interface.

I also added basic validation:

- Username cannot be empty.
- Username must be a string.
- Maximum username length is 20 characters.

One important detail: this is only username-based registration. It is not authentication. Users are not verified through an account or JWT.

## 5. Sending and Receiving Messages

Once a user joins, they can send messages.

The frontend emits a `send-message` event with the message payload.

The backend validates the message and creates a message object containing:

- Unique message ID.
- Username.
- Sender socket ID.
- Room name.
- Message content.
- Timestamp.

I used `crypto.randomUUID()` to generate unique message IDs.

The backend then broadcasts the message to the appropriate room:

```js
io.to(room).emit("receive-message", chatMessage);
```

The frontend listens for `receive-message` and updates its message state.

I used a functional state update to append new messages:

```js
setMessages((previousMessages) => [
  ...previousMessages,
  data,
]);
```

This is useful because it works with the latest state instead of relying on a potentially outdated value.

I also added validation for message content:

- Message cannot be empty.
- Message must be a string.
- Maximum message length is 500 characters.

## 6. Building Separate Chat Rooms

After implementing basic messaging, I added room functionality.

The purpose of rooms is to separate conversations between different groups of users.

For example:

- `room-101`
- `room-202`

Users inside `room-101` should not receive messages sent in `room-202`.

### Joining a room

The frontend emits:

```js
socket.emit("join-room", {
  room: roomName,
});
```

The backend checks whether the user has joined the chat and validates the room name.

It then adds the socket to the requested room:

```js
socket.join(cleanRoom);
```

I also made sure that a socket leaves its previous room before joining another one.

### Leaving a room

The frontend emits:

```js
socket.emit("leave-room");
```

The backend removes the socket from its current room:

```js
socket.leave(room);
```

After leaving, the server clears the stored room information.

### Sending messages to a room

Instead of broadcasting messages to every connected client, I used:

```js
io.to(room).emit("receive-message", chatMessage);
```

This sends the message to clients in that particular room, including the sender if they are still a member.

This was an important practical use of the room concepts from Chapter 3.

## 7. Frontend Components

As the application grew, I separated the UI into smaller components.

The frontend contains:

- `UsernameForm.jsx` – Allows users to enter a username and join the chat.
- `ChatHeader.jsx` – Displays chat information and connection status.
- `RoomForm.jsx` – Handles joining and leaving rooms.
- `MessageList.jsx` – Displays incoming and outgoing messages.
- `MessageInput.jsx` – Handles message input and submission.
- `App.jsx` – Manages application state and socket event listeners.
- `main.jsx` – Entry point of the React application.
- `socket.js` – Contains the Socket.IO client configuration.

This made the application easier to organize and maintain.

## 8. UI and Error Handling

I added a dark futuristic interface with:

- Full-screen chat layout.
- Dark background and subtle purple accents.
- Separate styles for outgoing and incoming messages.
- Room information.
- Connection status.
- Responsive styling.
- Input and button disabled states.
- Error messages for invalid actions.

I also added automatic scrolling to the latest message using a React ref inside the message list.

During implementation, I encountered a few issues caused by mismatched prop names.

For example, `App.jsx` passed `onSend` to `MessageInput`, but the component expected `onSubmit`.

Because the form did not receive the correct submit handler, the browser performed its normal form submission and reloaded the page.

I fixed this by making the prop names consistent between the parent and child components.

This was a useful reminder that component props are part of the communication contract between React components.

## 9. Testing

I tested the application using multiple browser tabs.

The following scenarios were tested:

- Multiple clients connecting to the backend.
- Different socket IDs for different browser tabs.
- Joining the chat with different usernames.
- Sending and receiving messages.
- Displaying the correct sender information.
- Rejecting empty usernames.
- Rejecting usernames longer than 20 characters.
- Rejecting empty messages.
- Rejecting messages longer than 500 characters.
- Joining the same room from multiple tabs.
- Receiving messages within the same room.
- Keeping messages isolated between different rooms.
- Leaving a room.
- Switching from one room to another.
- Checking the interface after a connection is lost.

These tests helped me understand how the application behaves when multiple clients interact with the same backend.

## 10. Important Things I Learned

### Socket.IO connection vs user identity

Every browser tab gets its own socket connection and socket ID.

A socket ID identifies a connection, not a permanent user.

In this project, usernames are stored in `socket.data.username`, but they are not authenticated identities.

### Rooms are managed by the server

The frontend requests to join or leave a room, but the actual room membership is managed by Socket.IO on the backend.

### React state and socket events

Socket events can arrive at any time, so the frontend needs to update state correctly when new messages or connection events arrive.

### Event names must match

The event name emitted by the frontend must match the event name listened for by the backend.

The same applies to component props between parent and child components.

### Messages are not persistent yet

Messages are currently stored in React state.

If the page is refreshed or the application restarts, previous messages are not restored.

A database would be needed to persist chat history.

## 11. Current Limitations and Future Improvements

There are still several things I would improve before treating this as a production-ready chat application:

- Store messages in MongoDB.
- Add user authentication using JWT.
- Restore the user's room after reconnection.
- Add online user presence.
- Add typing indicators.
- Add message delivery and read status.
- Improve room access permissions.
- Add proper message pagination.
- Add automated tests.

Some of these concepts will be covered in the upcoming Socket.IO chapters.

## 12. Final Takeaway

Building this application helped me move beyond testing individual Socket.IO events.

I now have practical experience connecting React with a Socket.IO backend, managing multiple clients, handling usernames, sending messages, and separating conversations using rooms.

It also helped me understand how real-time communication fits into a full-stack application.