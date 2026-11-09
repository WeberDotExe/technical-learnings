
import { useEffect, useState } from "react";
import { socket } from "./services/socket";

import UsernameForm from "./components/UsernameForm";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

import "./App.css";

const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");
  const [joined, setJoined] = useState(false);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setError("");
    };

    const onConnectError = (error) => {
  setIsConnected(false);
  setError(`Connection error: ${error.message}`);
};

    const onDisconnect = (reason) => {
      setIsConnected(false);
      setJoined(false);
      setActiveUsername("");
      setError(`Disconnected: ${reason}`);
    };

    const onChatJoined = (data) => {
      setActiveUsername(data.username);
      setJoined(true);
      setError("");
    };

    const onReceiveMessage = (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        data,
      ]);
    };

    const onChatError = (errorMessage) => {
      setError(errorMessage);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("chat-joined", onChatJoined);
    socket.on("receive-message", onReceiveMessage);
    socket.on("chat-error", onChatError);
    socket.on("connect_error", onConnectError);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("chat-joined", onChatJoined);
      socket.off("receive-message", onReceiveMessage);
      socket.off("chat-error", onChatError);
      socket.off("connect_error", onConnectError);

      socket.disconnect();
    };
  }, []);

  const handleJoinChat = (e) => {
    e.preventDefault();

    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError("Please enter a username.");
      return;
    }

    setError("");
    socket.emit("join-chat", cleanUsername);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || !socket.connected || !joined) {
      return;
    }

    socket.emit("send-message", {
      message: cleanMessage,
    });

    setMessage("");
  };

  return (
    <main className="app-container">
      <section className="chat-container">
        {!joined ? (
          <UsernameForm
            username={username}
            setUsername={setUsername}
            onSubmit={handleJoinChat}
            isConnected={isConnected}
          />
        ) : (
          <>
            <ChatHeader
              username={activeUsername}
              isConnected={isConnected}
            />

            <MessageList
              messages={messages}
              currentSocketId={socket.id}
            />

            <MessageInput
              message={message}
              setMessage={setMessage}
              onSubmit={handleSendMessage}
              disabled={!isConnected || !joined}
            />
          </>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </section>
    </main>
  );
};

export default App;
