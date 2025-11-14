// types et fonctions Message.ts
export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
};

/**
 * 🔹 Envoie un message à un autre utilisateur
 */
export async function SendMessage(senderId: string, receiverId: string, content: string): Promise<boolean> {
  try {
    const response = await fetch("https://api-campus.onrender.com/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur réseau lors de l’envoi du message", error);
    return false;
  }
}

/**
 * 🔹 Récupère les messages entre deux utilisateurs
 */
export async function GetMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
  try {
    const response = await fetch(`https://api-campus.onrender.com/messages/conversation/${userId1}/${userId2}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.messages as Message[];
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des messages", error);
    return [];
  }
}

/**
 * 🔹 Modifie le contenu d’un message
 */
export async function EditMessage(messageId: string, newContent: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api-campus.onrender.com/messages/edit/${messageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });
    return response.ok;
  } catch (error) {
    console.error("Erreur réseau lors de la modification du message", error);
    return false;
  }
}
