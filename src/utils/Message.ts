export type Message = {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
};

/**
 * 🔹 Envoie un message à un autre utilisateur
 * @param senderId 
 * @param receiverId 
 * @param content
 */
export async function SendMessage(senderId: string, receiverId: string, content: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:5000/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, content }),
    });
    if (response.ok) return true;
    console.error("Erreur lors de l’envoi du message");
    return false;
  } catch (error) {
    console.error("Erreur réseau lors de l’envoi du message", error);
    return false;
  }
}

/**
 * 🔹 Récupère les messages entre deux utilisateurs
 * @param userId1 
 * @param userId2 
 * @returns Tous les messages entre les deux utilisateurs
 */
export async function GetMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
  try {
    const response = await fetch(`http://localhost:5000/messages/conversation/${userId1}/${userId2}`);
    if (response.ok) {
      const data = await response.json();
      return data.messages as Message[];
    }
    console.error("Erreur lors de la récupération des messages");
    return [];
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des messages", error);
    return [];
  }
}

/**
 * Modifie le contenu d’un message spécifié
 * @param userId1
 * @param userId2
 * @param messageId 
 * @param newContent
 */
export async function EditMessage(messageId: string, newContent: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:5000/messages/edit/${messageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: newContent }),
    });
    if (response.ok) return true;
    console.error("Erreur lors de la modification du message");
    return false;
  } catch (error) {
    console.error("Erreur réseau lors de la modification du message", error);
    return false;
  }
}

/**Supprime un message spécifié
 * @param messageId 
 */