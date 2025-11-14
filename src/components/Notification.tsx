import { toast } from "react-toastify";

export default function Notifications({ status }: { status: string }) {
  switch (status) {
    case "pending":
      toast.success("Demande d’ami envoyée ✅");
      break;
    case "accepted":
      toast.info("Demande d’ami acceptée 👍");
      break;
    case "refused":
      toast.error("Demande d’ami refusée ❌");
      break;
    case "login":
      toast.success("Connexion réussie 👌");
      break;
    case "register":
      toast.success("Inscription réussie 🎉");
      break;
    case "logout":
      toast.info("Déconnexion réussie 👋");
      break;
    case "error":
      toast.error("Une erreur est survenue ❗");
      break;
    case 'deleteAccount':
      toast.info("Compte supprimé 🗑️");
      break;
    case "removed":
      toast.info("Ami supprimé 🗑️");
      break;
    case "updated":
      toast.success("Profil mis à jour ✔️");
      break;
     case "newRequest":
      toast.info("📬 Nouvelle demande d’ami reçue !");
      break;
    default:
      break;  
  }
}
