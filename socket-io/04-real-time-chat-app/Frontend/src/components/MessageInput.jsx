
const MessageInput = ({
  message,
  setMessage,
  onSend,
  disabled,
}) => {
  return (
    <form className="message-input-form" onSubmit={onSend}>
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type your message..."
        maxLength={500}
        disabled={disabled}
      />

      <button
        type="submit"
        disabled={disabled || !message.trim()}
      >
        Send
      </button>
    </form>
  );
};

export default MessageInput;
