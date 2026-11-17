
const RoomForm = ({
  roomName,
  setRoomName,
  activeRoom,
  onJoinRoom,
  onLeaveRoom,
  disabled,
}) => {
  return (
    <section className="room-panel">
      {activeRoom ? (
        <div className="active-room">
          <div>
            <span className="room-label">CURRENT ROOM</span>
            <h3>{activeRoom}</h3>
          </div>

          <button
            type="button"
            onClick={onLeaveRoom}
            disabled={disabled}
            className="leave-room-button"
          >
            Leave Room
          </button>
        </div>
      ) : (
        <form onSubmit={onJoinRoom} className="room-form">
          <input
            type="text"
            placeholder="Enter room name (e.g. room-101)"
            value={roomName}
            onChange={(event) => setRoomName(event.target.value)}
            disabled={disabled}
          />

          <button
            type="submit"
            disabled={disabled || !roomName.trim()}
          >
            Join Room
          </button>
        </form>
      )}
    </section>
  );
};

export default RoomForm;
