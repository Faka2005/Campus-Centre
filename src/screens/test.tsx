import { useState } from "react";
import { uploadUserProfilePhoto } from "../utils/Auth";
import { InfoUser } from "../utils/Storagelocal";

export default function Test() {
  const user = InfoUser("userId")?.toString() || "";
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>(InfoUser("photoUrl")?.toString() || "");

  // Lorsqu'on sélectionne une image
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // pour afficher un aperçu
  };

  // Lorsqu'on clique sur "Valider l'envoi"
  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner une image avant d’envoyer.");

    const res = await uploadUserProfilePhoto(user, file); // <-- Passer le fichier réel

    if (res.success) {
      alert("Photo envoyée avec succès ✅");
      setUploadedPhotoUrl(res.data.path); // mettre à jour l'image affichée
      sessionStorage.setItem("photoUrl", res.data.path);
    } else {
      alert("Erreur lors de l’envoi de la photo ❌");
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Page de Test</h1>
      <p>Upload d’une photo de profil</p>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: "15px" }}>
          <img
            src={preview}
            alt="Aperçu"
            style={{ width: "150px", height: "150px", borderRadius: "10px", objectFit: "cover" }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0078d7",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Valider l’envoi
      </button>

      {uploadedPhotoUrl ? (
        <img
          src="https://api-campus.onrender.com/uploads/1762622645420-Capture%20d'%C3%83%C2%A9cran%202025-08-16%20145451.png"
          alt="Photo de profil"
          style={{
            marginTop: "20px",
            width: "150px",
            height: "150px",
            borderRadius: "10px",
            objectFit: "cover",
          }}
        />
      ) : (
        <p>Aucune photo trouvée</p>
      )}
    </div>
  );
}
