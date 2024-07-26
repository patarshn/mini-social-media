import { io } from 'socket.io-client';

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(process.env.WEB_URL); // Your server URL
  }
  return socket;
}
