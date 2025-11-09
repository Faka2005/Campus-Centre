import { Form, Button, FormControl, InputGroup } from "react-bootstrap";
import { SendSignal } from "../utils/signaler";
import { toast } from "react-toastify";
import React from "react";
import { InfoUser } from "../utils/Storagelocal";

export default function SignalerScreen() {
  const senderId = InfoUser('userId')?.toString() ||""; // ID réel de l'utilisateur connecté
  const [content, setContent] = React.useState("");
  const [sujet, setSujet] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [disabled, setDisabled] = React.useState(true);

  // ✅ Corrige ici : mise à jour du bouton via useEffect
  React.useEffect(() => {
    if (content.trim() === "" || sujet === "") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [content, sujet]);

  

  const handleSubmit = async () => {
    setLoading(true);
    const success = await SendSignal(senderId, sujet, content);
    if (success) {
      toast.success("Signalement envoyé avec succès !");
      setContent("");
      setSujet("");
    } else {
      toast.error("Échec de l'envoi du signalement.");
    }
    setLoading(false);
  };

  return (
    <>
      <Form.Select value={sujet} onChange={(e) => setSujet(e.target.value)}>
        <option value="">Choisir le sujet du signalement</option>
        <option value="inapproprié">Contenu inapproprié</option>
        <option value="spam">Spam ou publicité</option>
        <option value="harcèlement">Harcèlement ou intimidation</option>
        <option value="usurpation">Usurpation d'identité</option>
        <option value="technique">Problème technique</option>
        <option value="vie privée">Violation de la vie privée</option>
        <option value="autre">Autre</option>
      </Form.Select>
      <InputGroup className="mb-3 mt-3">
        <FormControl
          as="textarea"
          aria-label="With textarea"
          placeholder="Décrivez le problème en détail..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </InputGroup>

      <Button
        variant="primary"
        disabled={loading || disabled}
        onClick={handleSubmit}
      >
        {loading ? "Envoi en cours..." : "Envoyer le signalement"}
      </Button>
    </>
  );
}
