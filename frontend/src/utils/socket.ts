import { io, Socket } from "socket.io-client";

const URL = import.meta.env.VITE_COMMUNICATION as string;

let socket: Socket;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(URL, {
      transports: ["websocket"],
      autoConnect: false,
    });
  }
  return socket;
};
