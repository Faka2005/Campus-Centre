import { useEffect, useState } from "react";
import { useUserStorage } from "../../utils/Storagelocal";
import {GetMessagesBetweenUsers,SendMessage,type Message,} from "../../utils/Message";
import { socket } from "../../utils/socketClient";
import * as React from "react";
export default function Message({ idFriend }: { idFriend: string | null }) {
  const user = useUserStorage();
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [messageSending, setMessageSending] = useState("");

  // 🔹 Envoyer un message
  const handleSendMessage = async () => {
    if (!user?.userId || !idFriend || messageSending.trim() === "") return;

    // Envoi au serveur via socket.io
    socket.emit("send_message", {
      senderId: user.userId,
      receiverId: idFriend,
      content: messageSending.trim(),
    });

    // Envoi en base via ton API REST (sécurité)
    await SendMessage(user.userId, idFriend, messageSending.trim());

    setMessageSending("");
  };

  // 🔹 Charger les messages au montage
  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?.userId || !idFriend) return;
      setLoading(true);
      const data = await GetMessagesBetweenUsers(user.userId, idFriend);
      if (data) setMessages(data);
      setLoading(false);
    };

    fetchMessages();
  }, [idFriend, user?.userId]);

  // 🔹 Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!socket) return;

    const handleIncoming = (msg: Message) => {
      if (
        msg.senderId === idFriend ||
        msg.receiverId === idFriend
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleIncoming);

    return () => {
      socket.off("receive_message", handleIncoming);
    };
  }, [idFriend]);

  if (!idFriend)
    return (
      <p style={{ textAlign: "center", padding: "20px" }}>
        👈 Sélectionne un ami pour discuter
      </p>
    );

  if (loading) return <p>Chargement des messages...</p>;

  return (
    <>
      <div style={{ padding: "10px", height: "75vh", overflowY: "auto" }}>
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            Aucun message pour l’instant
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              style={{
                textAlign: msg.senderId === user?.userId ? "right" : "left",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  display: "inline-block",
                  backgroundColor:
                    msg.senderId === user?.userId ? "#DCF8C6" : "#EAEAEA",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                }}
              >
                <p style={{ margin: 0 }}>{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
          type="text"
          value={messageSending}
          onChange={(e) => setMessageSending(e.target.value)}
          placeholder="Écrire un message..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSendMessage}
          style={{
            marginLeft: "8px",
            padding: "8px 16px",
            borderRadius: "4px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
          }}
        >
          Envoyer
        </button>
      </div>
    </>
  );
}
