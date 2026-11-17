# Real-Time Chat App

A real-time chat application built with React and Socket.IO. This project helped me understand how to connect a React frontend with a Socket.IO backend and handle communication between multiple users.

### What I built

- Set up an Express server with Socket.IO.
- Connected the React frontend using `socket.io-client`.
- Added username-based chat joining.
- Implemented real-time message sending and receiving.
- Added separate chat rooms so conversations stay isolated.
- Added room joining and leaving functionality.
- Displayed usernames, message timestamps, and sender information.
- Added connection status and basic error handling.
- Built a responsive, full-screen dark-themed chat interface.

### Tech Stack

- React
- Vite
- Node.js
- Express.js
- Socket.IO
- socket.io-client
- CSS

### Project Structure

```text
04-real-time-chat-app/
├── backend/
│   ├── src/
│   │   └── server.js
│   ├── .env
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   │   └── socket.js
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    └── package.json
```

### Running Locally

Start the backend:

```bash
cd backend
npm install
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm install
npm run dev
```

Configure the backend environment variables in `backend/.env`:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
```

Open the frontend URL provided by Vite in your browser.

### What I learned

This project gave me practical experience with real-time communication, Socket.IO events, React state management, room-based messaging, and handling client connection lifecycles.

I also learned how frontend and backend components need to agree on event names and component props for the application to work correctly.