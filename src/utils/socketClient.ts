import { io } from "socket.io-client";

export const socket = io("https://api-campus.onrender.com", { autoConnect: false });

export const joinNotifications = (userId: string) => {
  socket.connect();
  socket.emit("join_notifications", userId);
};
