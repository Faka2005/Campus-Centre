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

  const handleSubmit = async () => {
    setSaving(true);
    try {
      // 🔹 Mise à jour profil
      const res = await updateUserApi(user.userId, form);
      if (!res.success) throw new Error(res.message);

      // 🔹 Stockage des nouvelles données localement
      if (res.data.profil) setUserStorage(res.data.profil);

      // 🔹 Si nouvelle photo upload


      alert("Profil mis à jour ✅");
      navigate("/profile");
    } catch (err: any) {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil : " + err.message);
    } finally {
      setSaving(false);
    }
  };

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
