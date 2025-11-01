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
    LoginUserApi({email,password});
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

