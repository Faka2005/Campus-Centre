import { useEffect, useState, useCallback } from "react";
import { socket, joinNotifications } from "../utils/socketClient";
import {
  GetAcceptedFriends,
  GetPendingFriends,
  GetRefusedFriends,
  AcceptFriendRequest,
  RefuseFriendRequest,
  RemoveFriend,
  SendRequestFriends,
} from "../utils/Friends";
import type { FriendsUser } from "../utils/Friends";

interface Props {
  userId: string;
}

export default function FriendRequestsPage({ userId }: Props) {
  const [acceptedFriends, setAcceptedFriends] = useState<FriendsUser | null>(null);
  const [pendingFriends, setPendingFriends] = useState<FriendsUser | null>(null);
  const [refusedFriends, setRefusedFriends] = useState<FriendsUser | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);

  // 🔹 Fonctions stabilisées
  const fetchAcceptedFriends = useCallback(async () => {
    const data = await GetAcceptedFriends(userId);
    setAcceptedFriends(data);
  }, [userId]);

  const fetchPendingFriends = useCallback(async () => {
    const data = await GetPendingFriends(userId);
    setPendingFriends(data);
  }, [userId]);

  const fetchRefusedFriends = useCallback(async () => {
    const data = await GetRefusedFriends(userId);
    setRefusedFriends(data);
  }, [userId]);

  // 🔔 Initialisation socket
  useEffect(() => {
    joinNotifications(userId);

    socket.on("friend_request_received", (data) => {
      setNotifications((prev) => [...prev, data.message]);
      fetchPendingFriends(); // plus d'erreur, useCallback stabilise
    });

    return () => {
      socket.off("friend_request_received");
    };
  }, [userId, fetchPendingFriends]);

  // 🔹 Charger toutes les listes au montage
  useEffect(() => {
    fetchAcceptedFriends();
    fetchPendingFriends();
    fetchRefusedFriends();
  }, [fetchAcceptedFriends, fetchPendingFriends, fetchRefusedFriends]);

  // 🔹 Actions amis
  const handleAccept = async (senderId: string) => {
    await AcceptFriendRequest(senderId, userId);
    fetchAcceptedFriends();
    fetchPendingFriends();
  };

  const handleRefuse = async (senderId: string) => {
    await RefuseFriendRequest(senderId, userId);
    fetchPendingFriends();
    fetchRefusedFriends();
  };

  const handleRemove = async (friendId: string) => {
    await RemoveFriend(userId, friendId);
    fetchAcceptedFriends();
  };

  const handleSendRequest = async (receiverId: string) => {
    await SendRequestFriends(userId, receiverId);
    socket.emit("send_friend_request", { senderId: userId, receiverId });
  };

  return (
    <div className="dashboard">
      <h1>Bienvenue sur votre dashboard</h1>

      {/* 🔔 Notifications */}
      <div className="notifications">
        {notifications.map((msg, idx) => (
          <div key={idx} className="toast">
            {msg}
          </div>
        ))}
      </div>

      {/* 👥 Amis acceptés */}
      <section>
        <h2>Amis</h2>
        {acceptedFriends?.amis?.map((friend) => (
          <div key={friend._id}>
            {friend.firstName} {friend.lastName}{" "}
            <button onClick={() => handleRemove(friend.userId)}>Supprimer</button>
          </div>
        ))}
      </section>

      {/* ⏳ Demandes en attente */}
      <section>
        <h2>Demandes en attente</h2>
        {pendingFriends?.amis?.map((friend) => (
          <div key={friend._id}>
            {friend.firstName} {friend.lastName}{" "}
            <button onClick={() => handleAccept(friend.userId)}>Accepter</button>
            <button onClick={() => handleRefuse(friend.userId)}>Refuser</button>
          </div>
        ))}
      </section>

      {/* ❌ Demandes refusées */}
      <section>
        <h2>Demandes refusées</h2>
        {refusedFriends?.amis?.map((friend) => (
          <div key={friend._id}>
            {friend.firstName} {friend.lastName}
          </div>
        ))}
      </section>

      {/* ➕ Envoyer une demande */}
      <section>
        <h2>Ajouter un ami</h2>
        <input type="text" placeholder="ID utilisateur" id="newFriendId" />
        <button
          onClick={() => {
            const input = document.getElementById("newFriendId") as HTMLInputElement;
            if (input.value) handleSendRequest(input.value);
          }}
        >
          Envoyer demande
        </button>
      </section>
    </div>
  );
}
