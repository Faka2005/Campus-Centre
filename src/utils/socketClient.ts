// socketClient.ts
import { io, Socket } from "socket.io-client";
import { useState, useEffect } from "react";

// ⚡ Socket unique
export const socket: Socket = io("https://api-campus.onrender.com", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});

// ⚡ Rejoindre room notifications
export const joinNotifications = (userId: string): void => {
  if (!socket.connected) socket.connect();
  socket.emit("join_notifications", userId);
};

// ⚡ Rejoindre room chat
export const joinChat = (userId: string): void => {
  if (!socket.connected) socket.connect();
  socket.emit("join_chat", userId);
};

// ⚡ Hook React pour suivre les statuts
export function useUsersStatus(userIds: string[]): Record<string, boolean> {
  const [status, setStatus] = useState<Record<string, boolean>>({});

  useEffect((): (() => void) => {
    const handleStatus = (data: { userId: string; online: boolean }) => {
      setStatus(prev => ({ ...prev, [data.userId]: data.online }));
    };

    // ⚡ Écoute l'événement
    socket.on("user_status_update", handleStatus);

    // ⚡ Initialisation
    const initialStatus: Record<string, boolean> = {};
    userIds.forEach(id => (initialStatus[id] = false));
    setStatus(initialStatus);

    // ⚡ Fonction de nettoyage
    return (): void => {
      socket.off("user_status_update", handleStatus);
    };
  }, [userIds]);

  return status;
}
