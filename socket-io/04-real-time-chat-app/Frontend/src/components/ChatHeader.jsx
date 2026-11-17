
const ChatHeader = ({ username, isConnected,activeRoom }) => {
  return (
    <header className="chat-header">
      <div>
        <h1>Real-Time Chat</h1>
        <p>Welcome, {username}</p>

        {activeRoom && (
          <span className="header-room">
            Room:{activeRoom}
          </span>
        )}
      </div>


      <span className={`connection-status ${isConnected ? "connected" : "disconnected"}`}>
        {isConnected ? "Connected" : "Disconnected"}
      </span>
    </header>
  );
};

export default ChatHeader;
