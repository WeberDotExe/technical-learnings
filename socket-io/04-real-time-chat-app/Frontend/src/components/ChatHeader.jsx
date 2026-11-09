
const ChatHeader = ({ username, isConnected }) => {
  return (
    <header className="chat-header">
      <div>
        <h1>Real-Time Chat</h1>
        <p>Logged in as {username}</p>
      </div>

      <span className={`connection-status ${isConnected ? "online" : "offline"}`}>
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </header>
  );
};

export default ChatHeader;
