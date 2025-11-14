export type User = {
      _id: string;
      userId: string;
      firstName: string;
      lastName: string;
      sexe: string;
      bio: string;
      filiere: string;
      niveau: string;
      interests: string[];
      isTutor: boolean;
      campus: string;
      photoUrl: string;
      createdAt: string;
    };
    export async function ListUser(): Promise<User[]> {
  try {
    const res = await fetch("https://api-campus.onrender.com/profiles/users", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Erreur ListUser:", data.message);
      return [];
    }

    console.log("Profils récupérés:", data.profils);
    return data.profils || [];
  } catch (error) {
    console.error("Erreur réseau ListUser:", error);
    return [];
  }
}

export async function GetUserById(userId: string): Promise<User | null> {
  try {
    const res = await fetch(`https://api-campus.onrender.com/profiles/user/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Erreur dans GetUserById:", data.message);
      return null;
    }
    return data.profil || null;
  } catch (error) {
    console.error("Erreur réseau dans GetUserById:", error);
    return null;
  }
}
