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
    const res = await fetch("https://api-campus.onrender.com/profiles/user/", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Erreur dans ListUser:", data.message);
      return [];
    }

    console.log(data.profil);
    return data.profil || [];
  } catch (error) {
    console.error("Erreur réseau dans ListUser:", error);
    return [];
  }
}
