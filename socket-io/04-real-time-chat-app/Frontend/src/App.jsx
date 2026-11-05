import {useEffect,useState} from 'react'
import {socket} from './services/socket'

const App = () => {

    const [isConnected, setIsConnected] = useState(socket.connected);
    const [socketId, setSocketId] = useState('');

    useEffect(()=>{
      function onConnect(){
        setIsConnected(true);
        setSocketId(socket.id);
        console.log("connected",socket.id)
      }  

      function onDisconnect(reason){
        setIsConnected(false);
        setSocketId('');
        console.log("disconnected",reason)
      }

      socket.on("connect",onConnect);
      socket.on("disconnect",onDisconnect)
      socket.connect();

      return ()=>{
        socket.off("connect",onConnect);
        socket.off("disconnect",onDisconnect);
        socket.disconnect();
      }

    },[]);

  return (
    <main>
      <h1>Real time chat app</h1>

      <p>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </p>

      <p>Socket ID: {socketId || "not connected"}</p>
    </main>
  )
}

export default App