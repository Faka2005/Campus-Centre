import type { ApiLogin } from "./Storagelocal"

export type FriendsUser = {
  amis: ApiLogin[]; // même nom que le JSON du backend
  message?: string;
};

/**
 * 🔹 Récupère la liste des amis d’un utilisateur
 * @param id - ID de l’utilisateur
 */
export const GetFriendsUser = async (id: string): Promise<FriendsUser | null> => {
  try {
    const res = await fetch(`http://localhost:5000/friends/user/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Erreur dans GetFriendsUser:", data.message);
      return null;
    }

    return data as FriendsUser;
  } catch (error) {
    console.error("Erreur réseau dans GetFriendsUser:", error);
    return null;
  }
};

/**
 * 🔹 Compte le nombre d’amis d’un utilisateur
 * @param id - ID de l’utilisateur
 */
export const CountFriends = async (id: string): Promise<number> => {
  const friendsData = await GetFriendsUser(id);
  return friendsData?.amis?.length ?? 0;
};
