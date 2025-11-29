import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Button, Form, Spinner } from "react-bootstrap";
import { updateUserApi } from "../utils/Auth";
import { useUserStorage, setUserStorage, type ApiLogin } from "../utils/Storagelocal";

export default function EditProfilPage() {
  const navigate = useNavigate();
  const user = useUserStorage();

  const [form, setForm] = useState<Partial<ApiLogin>>({
    firstName: user?.firstName,
    lastName: user?.lastName,
    bio: user?.bio,
    filiere: user?.filiere,
    niveau: user?.niveau,
    campus: user?.campus,
    interests: user?.interests ?? [],
  });

  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleInterestChange = (index: number, value: string) => {
    const updated = [...(form.interests || [])];
    updated[index] = value;
    setForm((prev) => ({ ...prev, interests: updated }));
  };

  const addInterest = () => {
    setForm((prev) => ({
      ...prev,
      interests: [...(prev.interests || []), ""],
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const res = await updateUserApi(user.userId, form);
      if (!res.success) throw new Error(res.message);

      if (res.data.profil) setUserStorage(res.data.profil);

      alert("Profil mis à jour ✅");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour : " + err);
    } finally {
      setSaving(false);
    }
  };
  const Retour= ()=>{
    navigate('/')
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 text-center">Modifier mon profil</h2>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Prénom</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={form.firstName || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Nom</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={form.lastName || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as="textarea"
            name="bio"
            value={form.bio || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Filière</Form.Label>
          <Form.Control
            type="text"
            name="filiere"
            value={form.filiere || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Niveau</Form.Label>
          <Form.Control
            type="text"
            name="niveau"
            value={form.niveau || ""}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Campus</Form.Label>
          <Form.Control
            type="text"
            name="campus"
            value={form.campus || ""}
            onChange={handleChange}
          />
        </Form.Group>

        {/* Interests */}
        <Form.Group className="mb-3">
          <Form.Label>Centres d'intérêt</Form.Label>

          {(form.interests || []).map((interest, index) => (
            <Form.Control
              key={index}
              type="text"
              className="mb-2"
              value={interest}
              onChange={(e) => handleInterestChange(index, e.target.value)}
              placeholder={`Intérêt ${index + 1}`}
            />
          ))}

          <Button variant="outline-primary" className="mt-2" onClick={addInterest}>
            + Ajouter un intérêt
          </Button>
        </Form.Group>
        <Button variant="primary" onClick={Retour}>Annuler</Button>
        
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer"
          )}
        </Button>
      </Form>
    </Container>
  );
}
