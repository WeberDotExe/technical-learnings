
const MessageInput = ({ message, setMessage, onSubmit, disabled }) => {
  return (
    <form className="message-input-form" onSubmit={onSubmit}>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        maxLength={500}
        disabled={disabled}
      />

      <button type="submit" disabled={disabled || !message.trim()}>
        Send
      </button>
    </form>
  );
};

export default MessageInput;
