import Notifications from '../components/Notification';
import type { RegisterUser,LoginUser } from './Storagelocal';
import { setUserStorage } from './Storagelocal';
// api/Register.ts
export interface ApiError {
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
    LoginUserApi({email,password})
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
 * 🔹 Met à jour les informations de l’utilisateur
 * @param userId - ID de l’utilisateur
 * @param updates - Objet contenant les champs à mettre à jour
 * @return Objet indiquant le succès ou l’échec de l’opération
 */
export async function updateUserApi(userId: string, updates: Partial<RegisterUser>) {
  try {
    const res = await fetch(`https://api-campus.onrender.com/profiles/user/${userId}`, {
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

import { useEffect, useState } from "react";
import { socket } from "./socketClient";

type UserStatus = Record<string, boolean>; // userId => online/offline

export function useUsersStatus(userIds: string[]): UserStatus {
    const [status, setStatus] = useState<UserStatus>({});

    useEffect(() => {
        const handleStatus = (data: { userId: string; online: boolean }) => {
            setStatus((prev) => ({ ...prev, [data.userId]: data.online }));
        };

        socket.on("user_status_update", handleStatus);

        // Initialiser les statuts à false
        const initialStatus: UserStatus = {};
        userIds.forEach((id) => (initialStatus[id] = false));
        setStatus(initialStatus);

        return () => {
            socket.off("user_status_update", handleStatus);
        };
    }, [userIds]);

    return status;
}

