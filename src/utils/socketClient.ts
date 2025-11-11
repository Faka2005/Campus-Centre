// src/utils/socketClient.ts
import { io } from "socket.io-client";

// 🧩 URL de ton backend
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Connexion unique du client socket
export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
