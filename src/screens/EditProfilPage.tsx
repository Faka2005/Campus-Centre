export default function  EditProfilePage(){
    return <h1>Profile Edit</h1>
}



import { useState, useEffect, typeChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Form, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Avatar from "@mui/material/Avatar";
import {
fetchUserProfilePhoto,
uploadUserProfilePhoto,
updateUserApi,
} from "../utils/Auth";
import { InfoUser, useUserStorage, setUserStorage } from "../utils/Storagelocal";

export default function EditProfilePage() {
const navigate = useNavigate();
const user = useUserStorage();
const userId = InfoUser("userid")?.toString() || "";

const [firstName, setFirstName] = useState(user?.firstName || "");
const [lastName, setLastName] = useState(user?.lastName || "");
const [filiere, setFiliere] = useState(user?.filiere || "");
const [niveau, setNiveau] = useState(user?.niveau || "");
const [campus, setCampus] = useState(user?.campus || "");
const [bio, setBio] = useState(user?.bio || "");
const [photo, setPhoto] = useState<string | null>(user?.photoUrl || null);
const [file, setFile] = useState<File | null>(null);
const [saving, setSaving] = useState(false);

// Charger la photo existante si elle existe
useEffect(() => {
async function loadPhoto() {
if (!userId) return;
const photoUrl = await fetchUserProfilePhoto(userId);
setPhoto(photoUrl || user?.photoUrl || null);
}
loadPhoto();
}, [userId]);

// Gestion du changement de fichier
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
const selected = e.target.files?.[0];
if (!selected) return;
setFile(selected);
setPhoto(URL.createObjectURL(selected)); // aperçu
};

// Sauvegarde des modifications
const handleSave = async () => {
if (!userId) return;
setSaving(true);

try {
let uploadedPhotoUrl = photo;

// Upload de la photo si un fichier a été sélectionné
if (file) {
const uploadRes = await uploadUserProfilePhoto(userId, file);
if (uploadRes.success) {
uploadedPhotoUrl = uploadRes.data.fileUrl;
setUserStorage(uploadRes.updatedUser); // mettre à jour le sessionStorage
} else {
toast.error("Erreur lors de l’upload de la photo ❌");
setSaving(false);
return;
}
}

// Mise à jour des infos utilisateur
const updateRes = await updateUserApi(userId, {
firstName,
lastName,
filiere,
niveau,
campus,
bio,
photoUrl: uploadedPhotoUrl,
});

if (updateRes.success) {
toast.success("Profil mis à jour ✅");
navigate("/profile"); // redirection vers la page profil
} else {
toast.error("Erreur lors de la mise à jour du profil ❌");
}
} catch (err) {
console.error(err);
toast.error("Erreur serveur inattendue ❌");
} finally {
setSaving(false);
}
};

if (!user) {
return (
<Container className="text-center mt-5">
<h2>Vous devez être connecté pour éditer votre profil</h2>
<Button onClick={() => navigate("/login")}>Se connecter</Button>
</Container>
);
}

return (
<Container className="mt-4">
<h2 className="mb-4 text-center">✏️ Modifier mon profil</h2>

<div className="text-center mb-4">
<Avatar
src={photo ? `http://localhost:5000${photo}` : "/uploads/default-avatar.png"}
sx={{ width: 100, height: 100, margin: "0 auto" }}
/>
<Form.Group className="mt-2">
<Form.Label>Changer la photo</Form.Label>
<Form.Control type="file" accept="image/*" onChange={handleFileChange} />
</Form.Group>
</div>

<Form>
<Form.Group className="mb-3">
<Form.Label>Prénom</Form.Label>
<Form.Control
type="text"
value={firstName}
onChange={(e) => setFirstName(e.target.value)}
/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Nom</Form.Label>
<Form.Control
type="text"
value={lastName}
onChange={(e) => setLastName(e.target.value)}
/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Filière</Form.Label>
<Form.Control
type="text"
value={filiere}
onChange={(e) => setFiliere(e.target.value)}
/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Niveau</Form.Label>
<Form.Control
type="text"
value={niveau}
onChange={(e) => setNiveau(e.target.value)}
/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Campus</Form.Label>
<Form.Control
type="text"
value={campus}
onChange={(e) => setCampus(e.target.value)}
/>
</Form.Group>

<Form.Group className="mb-3">
<Form.Label>Bio</Form.Label>
<Form.Control
as="textarea"
rows={3}
value={bio}
onChange={(e) => setBio(e.target.value)}
/>
</Form.Group>

<div className="text-center">
<Button variant="primary" onClick={handleSave} disabled={saving}>
{saving ? (
<>
<Spinner animation="border" size="sm" className="me-2" />
Enregistrement...
</>
) : (
"Enregistrer les modifications"
)}
</Button>
</div>
</Form>
</Container>
);
}