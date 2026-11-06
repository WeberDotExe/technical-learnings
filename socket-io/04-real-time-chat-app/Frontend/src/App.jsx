
import { useEffect, useState } from "react";
import { socket } from "./services/socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketId, setSocketId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setSocketId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
      setSocketId("");
    }

    function onReceiveMessage(data) {
      setMessages((previousMessages) => [
        ...previousMessages,
        data,
      ]);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive-message", onReceiveMessage);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive-message", onReceiveMessage);
      socket.disconnect();
    };
  }, []);

  function handleSendMessage(e) {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || !socket.connected) {
      return;
    }

    socket.emit("send-message", {
      message: cleanMessage,
    });

    setMessage("");
  }

  return (
    <main>
      <h1>Real-Time Chat</h1>

      <p>
        Status: {isConnected ? "Connected" : "Disconnected"}
      </p>

      <p>Socket ID: {socketId || "Not connected"}</p>

      <hr />

      <h2>Messages</h2>

      <ul>
        {messages.map((item) => (
          <li key={item.id}>
            <strong>
              {item.senderId === socketId ? "You" : item.senderId}
            </strong>
            : {item.message}
            <small>
              {" "}
              ({new Date(item.timestamp).toLocaleTimeString()})
            </small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />

        <button type="submit" disabled={!isConnected}>
          Send
        </button>
      </form>
    </main>
  );
}

export default App;
