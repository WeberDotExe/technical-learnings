
const UsernameForm = ({
  username,
  setUsername,
  onJoin,
  disabled,
}) => {
  return (
    <form className="username-form" onSubmit={onJoin}>
      <h2>Join the conversation</h2>
      <p>Choose a username to get started.</p>

      <input
        type="text"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        placeholder="Enter your username"
        maxLength={20}
        required
      />

      <button type="submit" disabled={disabled}>
        Join Chat
      </button>
    </form>
  );
};

export default UsernameForm;
