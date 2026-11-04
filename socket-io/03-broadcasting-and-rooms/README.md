
# Broadcasting and Rooms in Socket.IO

This chapter focuses on how Socket.IO delivers messages to multiple connected clients and how rooms help organize those clients into separate communication groups.

I explored different broadcasting methods, tested how messages behave across multiple browser tabs, and implemented room-based messaging where clients can join, communicate, and leave specific rooms.

### What I Learned

- Broadcasting events to all connected clients.
- Sending messages while excluding the sender.
- Understanding Socket.IO rooms and their purpose.
- Joining and leaving rooms dynamically.
- Sending messages to specific rooms.
- Checking whether a socket belongs to a room.
- Handling room-related errors and validating message payloads.

### Practical Implementation

Built a small real-time room messaging system using Express.js and Socket.IO. Tested communication between multiple browser tabs to understand how broadcasting and room membership work.

### Technologies Used

- Node.js
- Express.js
- Socket.IO
- HTML
- JavaScript
