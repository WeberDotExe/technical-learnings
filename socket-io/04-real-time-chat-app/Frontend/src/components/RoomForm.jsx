import React from 'react'

const RoomForm = ({roomName,setRoomName,activeRoom,onJoinRoom,onLeaveRoom,disabled}) => {
  return (
    <section className="room-panel">
        {activeRoom ? (
            <div className='active-room'>
                <div>
                    <span className="room-label">current room</span>
                    <h4>{activeRoom}</h4>
                </div>

                <button type="button" onClick={onLeaveRoom} disabled={disabled} className="leave-room-button" >
                    Leave Room
                </button>

            </div>
        ):(
            <form onSubmit={onJoinRoom} className="room-form">
                <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="Enter room name"
                    disabled={disabled}
                />
                <button type="submit" disabled={disabled || !roomName.trim()}>
                    Join Room
                </button>
            </form>
        )}
    </section>
  )
}

export default RoomForm