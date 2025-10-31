import NotificationFriends from '../components/Notification';
import type { RegisterUser,LoginUser } from './Storagelocal';
import { setUserStorage } from './Storagelocal';
// api/Register.ts
interface ApiError {
  message?: string;
}
//https://api-campus.onrender.com

/**
 * 🔹 Enfregistre utilisateur
 * @param firstName- firstName de l’utilisateur
 * @param lastName - lastName de l’utilisateur
 * @param email- email de l’utilisateur
 * @param password - password de l’utilisateur
 * @param sexe - sexe de l’utilisateur
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
    return { success: true, data };
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("Erreur dans RegisterUserApi :", err);
    return { success: false, message: err.message || "Erreur serveur" };
  }
}

/**
 * 🔹 Déconnecte un utilisateur
 */
export function logout(){
  localStorage.removeItem('user');
  NotificationFriends({status:"logout"});
  window.location.reload();

}

