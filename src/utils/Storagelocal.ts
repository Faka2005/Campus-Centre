import { useState, useEffect } from "react";
interface ApiError {
  message?: string;
}
export type RegisterUser = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password:string
  sexe:string,
  theme?: string;
};
export type LoginUser={
  email:string,
  password:string
}
  export type ApiLogin={
    _id: string,
    userId: string,
    firstName: string,
    lastName: string,
    sexe:string,
    bio: string,
    filiere: string,
    niveau: string,
    interests: string[],
    isTutor: boolean,
    campus: string,
    photoUrl: string,
}



// utils/Storagelocal.ts
export const GetTheme = (): "light" | "dark" => {
  return (localStorage.getItem("theme") as "light" | "dark") || "light";
};

/**
 * 🔹 Bascule entre clair/sombre et enregistre le choix
 */
export const ToggleTheme = (): "light" | "dark" => {
  const current = GetTheme();
  const newTheme = current === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  return newTheme;
};

/**
 * Sauvegarde un utilisateur dans le localStorage
 * @param user types ApiLogin
 */
export  const setUserStorage = (user: ApiLogin) => {
  localStorage.setItem('user', JSON.stringify(user));
  GetTheme()
};


/**
 * Récupère un utilisateur depuis le localStorage
 * @returns un json
 */
export const getUserStorage = (): ApiLogin | null => {
  const data = localStorage.getItem("user");
  if (!data) return null;

  try {
    //Transforme le json en type ApiLogin
    const user: ApiLogin = JSON.parse(data);
    return user;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return null;
  }
};


/**
 * Supprime l'utilisateur du localStorage
 */
export const removeUserStorage = () => {
  localStorage.removeItem('user');
};

export const getUserStorageTuple = (): [
  string, string, string, string, string,string, string, string, string[], boolean, string, string
] => {
  const data = localStorage.getItem("user");
  if (!data) return ["", "", "", "","", "", "", "", [], false, "", ""];

  try {
    const { _id, userId, firstName, lastName, sexe,bio, filiere, niveau, interests, isTutor, campus, photoUrl } = JSON.parse(data);
    return [_id, userId || "", firstName, lastName ,sexe, bio || "", filiere || "", niveau || "", interests || [], isTutor || false, campus || "", photoUrl || ""];
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur :", error);
    return ["", "", "", "", "", "","", "", [], false, "", ""];
  }
};


/**
 * Récupère une info spécifique de l'utilisateur
 * @param info :Info souhaiter
 * @returns Tous les infos sinon l'info choisi
 */
export const InfoUser = (info?: string) => {
  const [
    _id,
    userId,
    firstName,
    lastName,
    sexe,
    bio,
    filiere,
    niveau,
    interests,
    isTutor,
    campus,
    photoUrl,
  ] = getUserStorageTuple(); // Assure-toi que getUserStorageTuple() retourne un tuple de 11 éléments

  if (!info) {
    return {
      _id,
      userId,
      firstName,
      lastName,
      sexe,
      bio,
      filiere,
      niveau,
      interests,
      isTutor,
      campus,
      photoUrl,
    };
  }
 switch (info.toLowerCase()) {
    case "id": return _id || null;
    case "userid": return userId || null;
    case "firstname": return firstName || null;
    case "lastname": return lastName || null;
    case "bio": return bio || null;
    case "filiere": return filiere || null;
    case "niveau": return niveau || null;
    case "interests": return interests || [];
    case "istutor": return isTutor || false;
    case "campus": return campus || null;
    case "photourl": return photoUrl || null;
    default: return null;
  }
};




/**
 * Regarde si l'utilisateur est connecté ou pas
 * @returns Renvoie l'utilisateur si connecter
 */
export const useUserStorage = (): ApiLogin | null => {
  const [user, setUser] = useState<ApiLogin | null>(getUserStorage());

  useEffect(() => {
    const handleStorageChange = () => {
      setUser(getUserStorage());
    };

    // Écoute les changements dans le localStorage (même depuis un autre onglet)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return user;
};
/**
 * 🔹 Met à jour le profil utilisateur
 * @param userId - ID de l'utilisateur
 * @param updates - Objet contenant les champs à mettre à jour
 * @returns { success: boolean, data?: ApiLogin, message?: string }
 */
export async function updateUserApi(
  userId: string,
  updates: Partial<ApiLogin>
) {
  try {
    const res = await fetch(`https://api-campus.onrender.com/profiles/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la mise à jour du profil");
    }

    // Mettre à jour l'utilisateur stocké localement (localStorage)
    if (data.profil) {
      setUserStorage(data.profil as ApiLogin);
    }

    return { success: true, data: data.profil as ApiLogin };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans updateUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}