import { useEffect, useState } from "react";
import { useUserStorage } from "../../utils/Storagelocal";
import { GetMessagesBetweenUsers,SendMessage, type Message } from "../../utils/Message";

export default function Message({ idFriend }: { idFriend: string | null }) {
  const user = useUserStorage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  
    const [messagesending,setMessagesSending]=useState('');

    const handleSendMessage=async()=>{
        if(!user?.userId || !idFriend || messagesending.trim()==='') return;
        const success=await SendMessage(user.userId,idFriend,messagesending.trim());
        if(success){
            setMessagesSending('');
            // Recharger les messages après l’envoi
            const data=await GetMessagesBetweenUsers(user.userId,idFriend);
            if(data) setMessages(data);
        }
    };

useEffect(() => {
  const fetchMessages = async () => {
    if (!user?.userId || !idFriend) return;
    console.log("Chargement des messages entre", user.userId, "et", idFriend);
    setLoading(true);
    const data = await GetMessagesBetweenUsers(user.userId, idFriend);
    console.log("Messages reçus :", data);
    if (data) setMessages(data);
    setLoading(false);
  };

  fetchMessages();
}, [idFriend, user?.userId]);


  if (!idFriend)
    return <p style={{ textAlign: "center", padding: "20px" }}>👈 Sélectionne un ami pour discuter</p>;

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
            key={msg._id}
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
    <div style={{ display: "flex", padding: "10px", borderTop: "1px solid #ddd" }}>
        <input
          type="text"
            value={messagesending}
            onChange={(e) => setMessagesSending(e.target.value)}
            placeholder="Écrire un message..."
            style={{ flex: 1, padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button
          onClick={handleSendMessage}
          style={{ marginLeft: "8px", padding: "8px 16px", borderRadius: "4px", backgroundColor: "#007bff", color: "#fff", border: "none" }}
        >
          Envoyer
        </button>
      </div>
    </>
  );
}
