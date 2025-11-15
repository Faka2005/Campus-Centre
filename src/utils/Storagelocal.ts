

import Notifications from '../components/Notification';
import type { RegisterUser,LoginUser, ApiLogin } from './Storagelocal';
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
{ firstName,
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
body: JSON.stringify({ email, password }),
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
sessionStorage.removeItem('user');
Notifications({status:"logout"});
window.location.reload();

}
export async function uploadUserProfilePhoto(userId: string, file: File) {
try {
const formData = new FormData();
formData.append("file", file);
formData.append("userId", userId);

const res = await fetch("http://localhost:5000/upload", {
method: "POST",
body: formData,
});

const data = await res.json();
if (!res.ok) throw new Error(data.message || "Erreur lors de l’upload");

// Stockage dans sessionStorage
const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
const updatedUser = { ...storedUser, photoUrl: data.fileUrl };
sessionStorage.setItem("user", JSON.stringify(updatedUser));

return { success: true, data, updatedUser }; // Renvoie l'objet mis à jour pour le composant
} catch (error: unknown) {
const err = error as Error;
console.error("Erreur dans uploadUserProfilePhoto :", err);
return { success: false, message: err.message };
}
}

// 🔹 Récupérer photo
export async function fetchUserProfilePhoto(userId: string): Promise<string | null> {
try {
const res = await fetch(`http://localhost:5000/file/${userId}`, {
method: "GET",
headers: { "Content-Type": "application/json" },
});

if (!res.ok) return null;

// Renvoie l'URL côté front (correspond à /file/:userId)
return `/file/${userId}`;

} catch (error) {
console.error("Erreur dans fetchUserProfilePhoto :", error);
return null;
}
}

interface ApiError {
message?: string;
}

/**
* 🔹 Met à jour le profil utilisateur
* @param userId - ID de l'utilisateur
* @param updates - Objet contenant les champs à mettre à jour (ex: firstName, lastName, bio, filiere, interests...)
* @returns { success: boolean, data?: any, message?: string }
*/
export async function updateUserApi(
userId: string,
updates: Partial<ApiLogin>
) {
try {
const res = await fetch(`http://localhost:5000/profiles/user/${userId}`, {
method: "PUT",
headers: { "Content-Type": "application/json" },
body: JSON.stringify(updates),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.message || "Erreur lors de la mise à jour du profil");
}

// Mettre à jour l'utilisateur stocké localement (sessionStorage)
if (data.profil) {
setUserStorage(data.profil);
}

return { success: true, data };
} catch (error: unknown) {
const err = error as ApiError;
console.error("Erreur dans updateUserApi :", err);
return { success: false, message: err.message || "Erreur serveur" };
}
}

import { useState, useEffect } from "react";
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
interests: [],
isTutor: boolean,
campus: string,
photoUrl: string,
}


// utils/Storagelocal.ts
export const GetTheme = (): "light" | "dark" => {
return (sessionStorage.getItem("theme") as "light" | "dark") || "light";
};

/**
* 🔹 Bascule entre clair/sombre et enregistre le choix
*/
export const ToggleTheme = (): "light" | "dark" => {
const current = GetTheme();
const newTheme = current === "dark" ? "light" : "dark";
sessionStorage.setItem("theme", newTheme);
return newTheme;
};

/**
* Sauvegarde un utilisateur dans le sessionStorage
* @param user types ApiLogin
*/
export const setUserStorage = (user: ApiLogin) => {
sessionStorage.setItem('user', JSON.stringify(user));
GetTheme()
};

/**
* Récupère un utilisateur depuis le sessionStorage
* @returns un json
*/
export const getUserStorage = (): ApiLogin | null => {
const data = sessionStorage.getItem("user");
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
* Supprime l'utilisateur du sessionStorage
*/
export const removeUserStorage = () => {
sessionStorage.removeItem('user');
};

export const getUserStorageTuple = (): [
string, string, string, string, string,string, string, string, string[], boolean, string, string
] => {
const data = sessionStorage.getItem("user");
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

// Écoute les changements dans le sessionStorage (même depuis un autre onglet)
window.addEventListener("storage", handleStorageChange);

return () => {
window.removeEventListener("storage", handleStorageChange);
};
}, []);

return user;
};

