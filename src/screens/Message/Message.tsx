import * as React from "react";
import { useUserStorage } from "../../utils/Storagelocal";
import { GetMessagesBetweenUsers, SendMessage } from "../../utils/Message";
import { socket } from "../../utils/socketClient";
import type { Message as MessageType } from "../../utils/Message";

import Button from "@mui/material/Button";

/* 🔹 Format WhatsApp */
function formatDateWhatsApp(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const n = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffDays = (n.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);

  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (diffDays === 1) {
    return "Hier";
  }

  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

interface MessageProps {
  idFriend: string | null;
}

export default function Message({ idFriend }: MessageProps) {
  const user = useUserStorage();
  const [messages, setMessages] = React.useState<MessageType[]>([]);
  const [messageSending, setMessageSending] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const bottomRef = React.useRef<HTMLDivElement | null>(null);

  const isDisabled = messageSending.trim() === "" || loading;

  /* 🔹 Charger les messages */
  React.useEffect(() => {
    if (!user?.userId || !idFriend) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const data = await GetMessagesBetweenUsers(user.userId, idFriend);
        setMessages(data);
      } catch (err) {
        console.error("Erreur lors du chargement des messages :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [idFriend, user?.userId]);

  /* 🔹 Réception en temps réel */
  React.useEffect(() => {
    if (!idFriend || !user?.userId) return;

    const handleIncoming = (msg: MessageType) => {
      if (
        (msg.senderId === idFriend && msg.receiverId === user.userId) ||
        (msg.senderId === user.userId && msg.receiverId === idFriend)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleIncoming);

    return () => {
      socket.off("receive_message", handleIncoming);
    };
  }, [idFriend, user?.userId]);

  /* 🔹 Scroll automatique */
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* 🔹 Envoi message */
  const handleSendMessage = async () => {
    if (isDisabled || !user?.userId || !idFriend) return;

    const newMessage: MessageType = {
      _id: Math.random().toString(36).substring(2, 9),
      senderId: user.userId,
      receiverId: idFriend,
      content: messageSending.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageSending("");

    socket.emit("send_message", newMessage);

    await SendMessage(user.userId, idFriend, newMessage.content);
  };

  /* 🔹 Si aucun ami */
  if (!idFriend)
    return (
      <p style={{ textAlign: "center", padding: "20px", color: "#666" }}>
        👈 Sélectionne un ami pour discuter
      </p>
    );

  if (loading) return <p>Chargement des messages...</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "80vh" }}>
      {/* Zone messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          backgroundColor: "#f5f5f5",
        }}
      >
        {messages.length === 0 ? (
          <p style={{ textAlign: "center", color: "#888" }}>
            Aucun message pour l’instant
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              style={{
                display: "flex",
                justifyContent:
                  msg.senderId === user?.userId ? "flex-end" : "flex-start",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  backgroundColor:
                    msg.senderId === user?.userId ? "#DCF8C6" : "#EAEAEA",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                }}
              >
                <p style={{ margin: 0 }}>{msg.content}</p>

                <p
                  style={{
                    fontSize: "0.75em",
                    color: "#888",
                    marginTop: "4px",
                    textAlign: "right",
                  }}
                >
                  {formatDateWhatsApp(msg.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        <div ref={bottomRef} />
      </div>

      {/* Zone input */}
      <div
        style={{
          display: "flex",
          padding: "10px",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <input
          type="text"
          value={messageSending}
          onChange={(e) => setMessageSending(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && handleSendMessage()}
          placeholder="Écrire un message..."
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />

        <Button
          variant="contained"
          disabled={isDisabled}
          onClick={handleSendMessage}
          style={{ marginLeft: "8px", borderRadius: "8px" }}
        >
          Envoyer
        </Button>
      </div>
    </div>
  );
}
