import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", { autoConnect: false });

export const joinNotifications = (userId: string) => {
  socket.connect();
  socket.emit("join_notifications", userId);
};
