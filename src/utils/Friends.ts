import type { ApiLogin } from "./Storagelocal"

export type FriendsUser = {
  amis: ApiLogin[]; // même nom que le JSON du backend
  message?: string;
};

/**
 * 🔹 Récupère la liste des amis acceptés d’un utilisateur
 * @param id - ID de l’utilisateur
 * @return Liste des amis acceptés ou null en cas d’erreur
 */
export async function GetAcceptedFriends  (id: string): Promise<FriendsUser | null>  {
  try {
    const res = await fetch(`https://api-campus.onrender.com/friends/accepted/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur dans GetFriendsUser:", data.message);
      return null;
    }
    console.log(data as FriendsUser);
    return data as FriendsUser;
  } catch (error) {
    console.error("Erreur réseau dans GetFriendsUser:", error);
    return null;
  }
};

/**
 * 🔹 Compte le nombre d’amis acceptés d’un utilisateur
 * @param id - ID de l’utilisateur
 */
export async function CountFriendsAccepted  (id: string): Promise<number>  {
  const friendsData = await GetAcceptedFriends(id);
  return friendsData?.amis?.length ?? 0;
};

/**
 * 🔹 Compte le nombre de requête d'amis d’un utilisateur
 * @param id - ID de l’utilisateur
 */
export async function CountFriendsPending   (id: string): Promise<number>  {
  const friendsData = await GetAcceptedFriends(id);
  return friendsData?.amis?.length ?? 0;
};

/**
 * 🔹 Envoie une demande d’ami à un autre utilisateur
 * @param senderId - ID de l'envoyeur
 * @param receiverId - ID du receveur
 * @returns Message de succès ou d’erreur
 */
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

    if (!res.ok) {
      console.error("❌ Erreur dans SendRequestFriends:", data.message);
      return data.message || "Erreur lors de l’envoi de la demande d’ami";
    }

    console.log("✅ Réponse serveur:", data);
    return data.message || "Demande envoyée avec succès";
  } catch (error) {
    console.error("🚨 Erreur réseau dans SendRequestFriends:", error);
    return "Erreur réseau — impossible d’envoyer la demande";
  }
}




/**
 * 🔹 Récupère les demandes d’amis en attente pour un utilisateur
 * @param id - ID de l’utilisateur
 * @return Liste des demandes d’amis en attente ou null en cas d’erreur
 */
export async function GetPendingFriends(id: string): Promise<FriendsUser | null> {
  // TODO: fetch GET /friends/pending/user/:id
  try {
    const res = await fetch(`https://api-campus.onrender.com/friends/pending/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur dans GetPendingFriends:", data.message);
      return null;
    }
    console.log(data as FriendsUser);
    return data as FriendsUser;
  } catch (error) {
    console.error("Erreur réseau dans GetPendingFriends:", error);
    return null;
  }
}


/**
 * 🔹 Récupère les demandes d’amis refusées pour un utilisateur
 * @param id - ID de l’utilisateur
 * @return Liste des demandes d’amis refusées ou null en cas d’erreur
 */
export async function GetRefusedFriends(id: string): Promise<FriendsUser | null> {
  // TODO: fetch GET /friends/refused/user/:id
    try {
    const res = await fetch(`https://api-campus.onrender.com/friends/refused/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur dans GetRefusedFriends:", data.message);
      return null;
    }
    console.log(data as FriendsUser);
    return data as FriendsUser;
  } catch (error) {
    console.error("Erreur réseau dans GetRefusedFriends:", error);
    return null;
  }
}

/**
 * 🔹 Met à jour le statut d’une relation d’amitié
 * (Accepter ou refuser une demande)
 * @param senderId - ID de l'envoyeur
 * @param receiverId - ID du receveur
 * @param status - Nouveau statut ("accepted" ou "refused")
 * @returns Message de succès ou d’erreur
 */
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

    if (!res.ok) {
      console.error("❌ Erreur dans UpdateFriendStatus:", data.message);
      return data.message || "Erreur lors de la mise à jour du statut";
    }

    console.log("✅ Statut mis à jour :", data);
    return data.message || "Mise à jour réussie ✅";
  } catch (error) {
    console.error("🚨 Erreur réseau dans UpdateFriendStatus:", error);
    return "Erreur réseau — impossible de mettre à jour la demande";
  }
}

/**
 * 🔹 Supprime une relation d’amitié existante
 * @param senderId - ID de l'envoyeur
 * @param receiverId - ID du receveur
 * @returns Message de succès ou d’erreur
 */
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

    if (!res.ok) {
      console.error("❌ Erreur dans DeleteFriend:", data.message);
      return data.message || "Erreur lors de la suppression de la relation";
    }

    console.log("🗑️ Relation supprimée :", data);
    return data.message || "Amitié supprimée avec succès";
  } catch (error) {
    console.error("🚨 Erreur réseau dans DeleteFriend:", error);
    return "Erreur réseau — impossible de supprimer la relation";
  }
}

/**
 * 🔹 Accepter une demande d’ami
 * @param senderId - ID de l’envoyeur
 * @param receiverId - ID du receveur
 * @returns Message de succès ou d’erreur
 */
export async function AcceptFriendRequest(
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const message = await UpdateFriendStatus(senderId, receiverId, "accepted");
    return message || "Demande d’ami acceptée ✅";
  } catch (error) {
    console.error("Erreur dans AcceptFriendRequest:", error);
    return "Erreur lors de l’acceptation de la demande ❌";
  }
}

/**
 * 🔹 Refuser une demande d’ami
 * @param senderId - ID de l’envoyeur
 * @param receiverId - ID du receveur
 * @returns Message de succès ou d’erreur
 */
export async function RefuseFriendRequest(
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const message = await UpdateFriendStatus(senderId, receiverId, "refused");
    return message || "Demande d’ami refusée ❌";
  } catch (error) {
    console.error("Erreur dans RefuseFriendRequest:", error);
    return "Erreur lors du refus de la demande ❌";
  }
}

/***
 * 🔹 Supprime un ami
 * @param senderId - ID de l'envoyeur
 * @param receiverId - ID du receveur
 * @returns Message de succès ou d’erreur
 */
export async function RemoveFriend(
  senderId: string,
  receiverId: string
): Promise<string> {
  try {
    const message = await DeleteFriend(senderId, receiverId);
    return message || "Vous êtes plus amis avec cet utilisateur 🗑️";
  } catch (error) {
    console.error("Erreur dans RemoveFriend:", error);
    return "Erreur lors de la suppression de l’amitié ❌";
  }
}
