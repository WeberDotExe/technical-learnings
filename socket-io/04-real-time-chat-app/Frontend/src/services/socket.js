import {io} from "socket.io-client";

const socket_URL = "http://localhost:5000";

export const socket = io(socket_URL,{
    autoConnect: false,
})