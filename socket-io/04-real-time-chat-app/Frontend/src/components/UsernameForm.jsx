
const UsernameForm = ({ username, setUsername, onSubmit, isConnected }) => {
  return (
    <form className="username-form" onSubmit={onSubmit}>
      <h2>Join the conversation</h2>
      <p>Choose a username to get started.</p>

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        maxLength={20}
        required
      />

      <button type="submit" disabled={!isConnected}>
        Join Chat
      </button>
    </form>
  );
};

export default UsernameForm;
