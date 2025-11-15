import Notifications from '../components/Notification';
import type { RegisterUser,LoginUser } from './Storagelocal';
import { setUserStorage } from './Storagelocal';
// api/Register.ts
interface ApiError {
  message?: string;
}
//https://api-campus.onrender.com

/**
 * 🔹 Enfregistre utilisateur et le connecte
 * @param firstName- firstName de l’utilisateur
 * @param lastName - lastName de l’utilisateur
 * @param email- email de l’utilisateur
 * @param password - password de l’utilisateur
 * @param sexe - sexe de l’utilisateur
 * @return Objet indiquant le succès ou l’échec de l’opération
 */
export async function RegisterUserApi(
{  firstName,
  lastName,
  email,
  password,
  sexe}:RegisterUser
) {
  try {
    const res = await fetch("https://api-campus.onrender.com/register/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, email, password ,sexe}),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de l’inscription");
    }
    
    return { success: true, data };
    
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans RegisterUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * 🔹 Connecte utilisateur
 * @param email- email de l’utilisateur
 * @param password - password de l’utilisateur
 * @return Objet indiquant le succès ou l’échec de l’opération
 */
export async function LoginUserApi(
  {email,
  password}:LoginUser
) {
  try {
    const res = await fetch("https://api-campus.onrender.com/login/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({  email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la connexion");
    }
    if(data.profile)setUserStorage(data.profile)
    window.location.reload();
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans RegisterUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * 🔹 Supprime un utilisateur de la base de données
 * @param id - ID de l’utilisateur
 * @return Objet indiquant le succès ou l’échec de l’opération
 */
export async function DeleteUserApi(id: string) {
  try {
    const res = await fetch(`https://api-campus.onrender.com/delete/user/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la suppression de l’utilisateur");
    }

    Notifications({ status: "deleteAccount" });
    logout();

    return { success: true, data };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans DeleteUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * 🔹 Déconnecte un utilisateur
 */
export function logout(){
  localStorage.removeItem('user');
  Notifications({status:"logout"});
  window.location.reload();

}

/**
 * Récupère la photo de profil d’un utilisateur
 * @param userId - ID de l’utilisateur
 * @return URL de la photo de profil ou null en cas d’erreur
 */
export async function fetchUserProfilePhoto(userId: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api-campus.onrender.com/user/photo/${userId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
      throw new Error("Erreur lors de la récupération de la photo de profil");
    }

    const data = await res.json();
    return data.photoUrl; // Supposant que l’API renvoie l’URL de la photo sous la clé 'photoUrl'
  } catch (error) {
    console.error("Erreur dans fetchUserProfilePhoto :", error);
    return null;
  }
}
 
/**
 * 🔹 Met à jour les informations de l’utilisateur
 * @param userId - ID de l’utilisateur
 * @param updates - Objet contenant les champs à mettre à jour
 * @return Objet indiquant le succès ou l’échec de l’opération
 */
export async function updateUserApi(userId: string, updates: Partial<RegisterUser>) {
  try {
    const res = await fetch(`https://api-campus.onrender.com/user/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Erreur lors de la mise à jour de l’utilisateur");
    } 
    setUserStorage(data.updatedUser);
    Notifications({ status: "updateProfile" });

    return { success: true, data };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans updateUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

export async function uploadUserProfilePhoto(userId: string, file: File) {
  try {
    const formData = new FormData();
    formData.append("photo", file);
    formData.append("userId", userId);

    const res = await fetch("https://api-campus.onrender.com/photo", {
      method: "POST",
      body: formData, // <-- pas de Content-Type
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    console.log("✅ Photo uploadée :", data);
    localStorage.setItem("userPhoto", data.path);
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Erreur dans uploadUserProfilePhoto :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}
