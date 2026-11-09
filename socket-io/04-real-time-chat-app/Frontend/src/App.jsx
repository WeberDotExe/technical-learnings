
import { useEffect, useState } from "react";
import { socket } from "./services/socket";

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setJoined(false);
      setActiveUsername("");
    }

    function onChatJoined(data) {
      setActiveUsername(data.username);
      setJoined(true);
      setError("");
    }

    function onReceiveMessage(data) {
      setMessages((previousMessages) => [
        ...previousMessages,
        data,
      ]);
    }

    function onChatError(errorMessage) {
      setError(errorMessage);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat-joined", onChatJoined);
    socket.on("receive-message", onReceiveMessage);
    socket.on("chat-error", onChatError);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat-joined", onChatJoined);
      socket.off("receive-message", onReceiveMessage);
      socket.off("chat-error", onChatError);

      socket.disconnect();
    };
  }, []);

  function handleJoinChat(e) {
    e.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Please enter a username.");
      return;
    }

    socket.emit("join-chat", cleanUsername);
  }

  function handleSendMessage(e) {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || !socket.connected || !joined) {
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

      {!joined ? (
        <form onSubmit={handleJoinChat}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            maxLength={20}
          />

          <button type="submit" disabled={!isConnected}>
            Join Chat
          </button>
        </form>
      ) : (
        <>
          <p>Welcome, {activeUsername}!</p>

          <hr />

          <h2>Messages</h2>

          <ul>
            {messages.map((item) => (
              <li key={item.id}>
                <strong>
                  {item.senderId === socket.id
                    ? "You"
                    : item.username}
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
              maxLength={500}
            />

            <button type="submit" disabled={!isConnected}>
              Send
            </button>
          </form>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}

export default App;
