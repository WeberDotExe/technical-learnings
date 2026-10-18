# Events and Connection Lifecycle — Notes

## 1. Connection Lifecycle

A Socket.IO connection has a lifecycle. A client connects to the server, exchanges events, and may disconnect because of a manual action, network problem, or server shutdown.

On the server, I used the `connection` event to detect when a client connects.

```javascript
io.on("connection", (socket) => {
  console.log("Client connected");
  console.log("Socket ID:", socket.id);
});
```

On the client, I used `connect` and `disconnect` to track the connection state.

```javascript
socket.on("connect", () => {
  console.log("Connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("Disconnected:", reason);
});
```

The server's `connection` event and the client's `connect` event serve similar purposes, but they run on different sides of the application.

## 2. Socket IDs

Every active Socket.IO connection has a socket ID.

I noticed that when a client disconnected and reconnected, it received a different socket ID.

This means a socket ID identifies a connection, not a permanent user.

If an application needs to identify users across reconnections or multiple devices, it should use a separate user identity, usually established through authentication.

## 3. Transport Upgrade

During my tests, the server logged:

```text
transport: polling
transport upgraded to: websocket
```

Socket.IO can initially establish a connection using HTTP long-polling and then upgrade to WebSocket when possible.

### What I learned

- **Polling:** The client communicates through repeated HTTP requests.
- **WebSocket:** The client and server can communicate over a persistent, two-way connection.
- **Transport upgrade:** Socket.IO can switch from polling to WebSocket without requiring me to implement the upgrade manually.

I used this code on the server to observe the transport:

```javascript
io.on("connection", (socket) => {
  console.log("Transport:", socket.conn.transport.name);

  socket.conn.on("upgrade", (transport) => {
    console.log("Transport upgraded to:", transport.name);
  });
});
```

The initial transport can vary depending on the connection configuration and environment.

## 4. Disconnect Reasons

I logged the reason passed to the `disconnect` event to understand why a connection closed.

```javascript
socket.on("disconnect", (reason) => {
  console.log("Client disconnected");
  console.log("Reason:", reason);
});
```

Some reasons I learned about are:

| Reason | Meaning |
|---|---|
| `client namespace disconnect` | The client intentionally disconnected its Socket.IO connection. |
| `server namespace disconnect` | The server intentionally disconnected the socket. |
| `transport close` | The underlying transport closed. |
| `transport error` | A transport-level error occurred. |
| `ping timeout` | The connection did not receive the expected heartbeat response in time. |

The reason helps explain what happened, but it should not be treated as a complete diagnosis of the problem.

## 5. Automatic Reconnection

Socket.IO normally attempts to reconnect automatically after an unexpected disconnection.

I tested this by interrupting the network connection in the browser's developer tools and restoring it. I also stopped the server, observed the connection failures, and restarted it.

The client can listen for reconnection-related events:

```javascript
socket.io.on("reconnect_attempt", (attempt) => {
  console.log("Reconnection attempt:", attempt);
});

socket.io.on("reconnect", (attempt) => {
  console.log("Reconnected after attempts:", attempt);
});
```

These are Socket.IO Manager events, so I listen for them on `socket.io`, rather than directly on `socket`.

Automatic reconnection is useful when a temporary network interruption occurs. However, the client should still show an appropriate status while disconnected.

## 6. Manual Reconnection

I also tested what happens when automatic reconnection is disabled.

```javascript
const socket = io({
  reconnection: false,
});
```

With this option, Socket.IO does not automatically retry failed connections.

I then used `socket.connect()` to initiate a connection attempt manually.

```javascript
if (!socket.connected) {
  socket.connect();
}
```

Other useful methods and properties are:

```javascript
socket.disconnect();
socket.connect();
socket.connected;
```

- `socket.disconnect()` closes the client's Socket.IO connection.
- `socket.connect()` initiates a connection attempt.
- `socket.connected` tells me whether the socket is currently connected.

Calling `socket.disconnect()` intentionally suppresses automatic reconnection. Calling `socket.connect()` later allows the client to connect again.

Manual reconnection is useful when the application needs to let users control when they retry.

## 7. Connection Errors

A connection error occurs when a connection attempt fails. For example, the server might be unavailable when the browser tries to connect.

I handled this on the client:

```javascript
socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});
```

The `connect_error` event is different from `disconnect`.

- `disconnect` reports that an established connection has closed.
- `connect_error` reports that a connection attempt failed.

When the server is unavailable, the client may repeatedly encounter `connect_error` events while automatic reconnection is enabled.

Once the server becomes available again, a subsequent attempt can succeed and trigger `connect`.

## 8. Acknowledgements

An acknowledgement lets the receiver respond to an event using a callback supplied by the sender.

I tested this by sending an answer from the browser to the server and returning a response.

### Client

```javascript
socket.emit("save-answer", { answer }, (response) => {
  console.log("Server response:", response);
});
```

### Server

```javascript
socket.on("save-answer", (data, acknowledge) => {
  console.log("Answer received:", data.answer);

  if (typeof acknowledge === "function") {
    acknowledge({
      success: true,
      message: "Answer received by the server!",
      receivedAnswer: data.answer,
    });
  }
});
```

The client passes a callback when emitting the event. The server invokes that callback by calling the acknowledgement function it receives.

The server can return useful information, such as whether an operation succeeded.

An acknowledgement does not automatically guarantee that data has been permanently saved. That depends on what the server actually does before responding.

## 9. Acknowledgement Timeouts

I tested what happens when the server receives an event but deliberately skips the acknowledgement.

Without a timeout, the callback waiting for the acknowledgement will not run unless the server eventually invokes it.

Socket.IO provides `timeout()` to limit how long the client waits.

```javascript
socket.timeout(3000).emit(
  "save-answer",
  { answer },
  (error, response) => {
    if (error) {
      console.log("Acknowledgement timed out");
      return;
    }

    console.log("Server response:", response);
  }
);
```

Here, `3000` represents three seconds.

- If the acknowledgement arrives within the timeout, the callback receives the response.
- If the acknowledgement does not arrive in time, the callback receives an error.

### Important lesson

An acknowledgement timeout does not necessarily mean that the server failed to process the event. The server may have completed the operation but failed to send the acknowledgement in time.

For operations that modify data, retrying blindly can cause duplicate actions. Real applications may need request IDs, idempotency, or a way to check the operation's status.

## 10. Practical Lessons

These experiments helped me understand several important points:

- A connection can close and later reconnect.
- A socket ID is not a permanent user identity.
- Socket.IO can upgrade from polling to WebSocket.
- Connection failures and established-connection disconnections are different events.
- Automatic and manual reconnection serve different purposes.
- Acknowledgements let the sender receive a response to an event.
- Acknowledgement timeouts help prevent the client from waiting indefinitely.
- A timeout does not prove that the server failed to process an operation.

## 11. How This Applies to Scenario Lab

Scenario Lab will rely on real-time communication, so these concepts are important for handling interrupted connections and delivering a reliable user experience.

For example, if a user loses their internet connection during a practice session, the interface should communicate the disconnected state and attempt recovery where appropriate.

If the client submits an answer and waits for the server to process it, an acknowledgement can confirm that the server handled the request. A timeout can inform the interface when that confirmation did not arrive in time.

Understanding these behaviors gives me a foundation for building more reliable real-time applications with Socket.IO.