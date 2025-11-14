import type { ApiLogin } from "./Storagelocal";

export type FriendsUser = {
  amis: ApiLogin[];
  message?: string;
};

// 🔹 Fonction générique pour récupérer des amis selon le chemin
async function fetchFriends(path: string): Promise<FriendsUser | null> {
  try {
    const res = await fetch(`https://api-campus.onrender.com/friends/${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur fetchFriends:", data.message);
      return null;
    }

    return data as FriendsUser;
  } catch (error) {
    console.error("Erreur réseau fetchFriends:", error);
    return null;
  }
}

// 🔹 Fonctions spécifiques
export const GetAcceptedFriends = (id: string) =>
  fetchFriends(`accepted/user/${id}`);

export const GetPendingFriends = (id: string) =>
  fetchFriends(`pending/user/${id}`);

export const GetRefusedFriends = (id: string) =>
  fetchFriends(`refused/user/${id}`);

// 🔹 Compteurs
export async function CountFriendsAccepted(id: string): Promise<number> {
  const friends = await GetAcceptedFriends(id);
  return friends?.amis.length ?? 0;
}

export async function CountFriendsPending(id: string): Promise<number> {
  const friends = await GetPendingFriends(id);
  return friends?.amis.length ?? 0;
}

// 🔹 Gestion des demandes d’amis
export async function SendRequestFriends(
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const res = await fetch("https://api-campus.onrender.com/friends/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId }),
    });

    const data = await res.json();
    if (!res.ok) return data.message || "Erreur lors de l’envoi de la demande";
    return data.message || "Demande envoyée ✅";
  } catch (error) {
    console.error("Erreur réseau SendRequestFriends:", error);
    return "Erreur réseau — impossible d’envoyer la demande";
  }
}

export async function UpdateFriendStatus(
  senderId: string,
  receiverId: string,
  status: "accepted" | "refused"
): Promise<string> {
  try {
    const res = await fetch("https://api-campus.onrender.com/friends/user", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId, status }),
    });

    const data = await res.json();
    if (!res.ok) return data.message || "Erreur lors de la mise à jour";
    return data.message || `Statut mis à jour ✅`;
  } catch (error) {
    console.error("Erreur réseau UpdateFriendStatus:", error);
    return "Erreur réseau — impossible de mettre à jour";
  }
}

export async function DeleteFriend(
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const res = await fetch("https://api-campus.onrender.com/friends/user", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, receiverId }),
    });

    const data = await res.json();
    if (!res.ok) return data.message || "Erreur lors de la suppression";
    return data.message || "Amitié supprimée ✅";
  } catch (error) {
    console.error("Erreur réseau DeleteFriend:", error);
    return "Erreur réseau — impossible de supprimer";
  }
}

// 🔹 Fonctions utilitaires
export const AcceptFriendRequest = (senderId: string, receiverId: string) =>
  UpdateFriendStatus(senderId, receiverId, "accepted");

export const RefuseFriendRequest = (senderId: string, receiverId: string) =>
  UpdateFriendStatus(senderId, receiverId, "refused");

export const RemoveFriend = (senderId: string, receiverId: string) =>
  DeleteFriend(senderId, receiverId);
