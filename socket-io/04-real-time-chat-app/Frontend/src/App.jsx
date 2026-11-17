
import { useEffect, useState } from "react";

import { socket } from "./services/socket";

import UsernameForm from "./components/UsernameForm";
import RoomForm from "./components/RoomForm";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";

import "./App.css";

const App = () => {
  const [isConnected, setIsConnected] = useState(false);

  const [username, setUsername] = useState("");
  const [activeUsername, setActiveUsername] = useState("");

  const [joined, setJoined] = useState(false);

  const [roomName, setRoomName] = useState("");
  const [activeRoom, setActiveRoom] = useState("");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setError("");
    };

    const onDisconnect = () => {
      setIsConnected(false);
      setJoined(false);
      setActiveUsername("");
      setActiveRoom("");
      setMessages([]);
      setError("Disconnected from the server. Please reconnect.");
    };

    const onConnectError = (error) => {
      setError(error.message);
    };

    const onChatJoined = (data) => {
      setActiveUsername(data.username);
      setJoined(true);
      setError("");
    };

    const onRoomJoined = (room) => {
      setActiveRoom(room);
      setRoomName("");
      setMessages([]);
      setError("");
    };

    const onRoomLeft = () => {
      setActiveRoom("");
      setMessages([]);
      setError("");
    };

    const onReceiveMessage = (data) => {
      setMessages((previousMessages) => [
        ...previousMessages,
        data,
      ]);
    };

    const onChatError = (message) => {
      setError(message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    socket.on("chat-joined", onChatJoined);
    socket.on("room-joined", onRoomJoined);
    socket.on("room-left", onRoomLeft);

    socket.on("receive-message", onReceiveMessage);
    socket.on("chat-error", onChatError);

    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);

      socket.off("chat-joined", onChatJoined);
      socket.off("room-joined", onRoomJoined);
      socket.off("room-left", onRoomLeft);

      socket.off("receive-message", onReceiveMessage);
      socket.off("chat-error", onChatError);

      socket.disconnect();
    };
  }, []);

  const handleJoinChat = (event) => {
    event.preventDefault();

    if (!username.trim() || !isConnected) return;

    setError("");
    socket.emit("join-chat", username);
  };

  const handleJoinRoom = (event) => {
    event.preventDefault();

    if (!roomName.trim() || !joined) return;

    setError("");
    socket.emit("join-room", roomName);
  };

  const handleLeaveRoom = () => {
    if (!activeRoom) return;

    setError("");
    socket.emit("leave-room");
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!message.trim() || !activeRoom) return;

    socket.emit("send-message", {
      message,
    });

    setMessage("");
  };

  return (
    <main className="app-container">
      {!joined ? (
        <UsernameForm
          username={username}
          setUsername={setUsername}
          onJoin={handleJoinChat}
          disabled={!isConnected}
          isConnected={isConnected}
        />
      ) : (
        <div className="chat-container">
          <ChatHeader
            username={activeUsername}
            isConnected={isConnected}
            activeRoom={activeRoom}
          />

          <RoomForm
            roomName={roomName}
            setRoomName={setRoomName}
            activeRoom={activeRoom}
            onJoinRoom={handleJoinRoom}
            onLeaveRoom={handleLeaveRoom}
            disabled={!isConnected}
          />

          {activeRoom ? (
            <>
              <MessageList
                messages={messages}
                socketId={socket.id}
              />

              <MessageInput
                message={message}
                setMessage={setMessage}
                onSend={handleSendMessage}
                disabled={!isConnected}
              />
            </>
          ) : (
            <div className="room-placeholder">
              <h2>Join a room to start chatting</h2>
              <p>
                Enter a room name above to start a separate
                conversation.
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="error-message">{error}</p>
      )}
    </main>
  );
};

export default App;
