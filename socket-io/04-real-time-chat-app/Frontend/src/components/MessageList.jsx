
import { useEffect, useRef } from "react";

const MessageList = ({ messages, currentSocketId }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <p className="empty-state">
          No messages yet. Start the conversation!
        </p>
      ) : (
        messages.map((item) => {
          const isOwnMessage = item.senderId === currentSocketId;

          return (
            <div
              key={item.id}
              className={`message-row ${isOwnMessage ? "own-message" : "other-message"}`}
            >
              <div className="message-bubble">
                <span className="message-username">
                  {isOwnMessage ? "You" : item.username}
                </span>

                <p>{item.message}</p>

                <span className="message-time">
                  {new Date(item.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
