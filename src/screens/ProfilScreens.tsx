

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Spinner, Modal, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { DeleteUserApi } from "../utils/Auth";
import { InfoUser, useUserStorage } from "../utils/Storagelocal";
import Avatar from "@mui/material/Avatar";

export default function ProfilScreens() {
    const navigate = useNavigate();
    const user = useUserStorage();
    const userId = InfoUser("userid")?.toString();
    const [deleting, setDeleting] = React.useState(false);
    const [showModal, setShowModal] = React.useState(false);

    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);



    // 🔥 Suppression de compte
    const handleDeleteAccount = async () => {
        if (!userId) {
            toast.error("Impossible de trouver ton identifiant utilisateur ❌");
            return;
        }

        try {
            setDeleting(true);
            const res = await DeleteUserApi(userId);

            if (res.success) {
                toast.success("✅ Ton compte a été supprimé avec succès !");
            } else {
                toast.error("❌ Une erreur est survenue : " + res.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Erreur inattendue lors de la suppression du compte.");
        } finally {
            setDeleting(false);
            handleClose();
        }
    };

    // 🧑 Si pas connecté
    if (!user) {
        return (
            <Container
                fluid
                className="text-center d-flex flex-column justify-content-center align-items-center"
                style={{ height: "80vh" }}
            >
                <h2>Bienvenue sur CampusConnect 👋</h2>
                <p>Connectez-vous pour accéder à votre profil personnel.</p>
                <Button variant="primary" onClick={() => navigate("/login")}>
                    Se connecter
                </Button>
            </Container>
        );
    }

    return (
        <div className="p-3">

            <Avatar src="/uploads/default-avatar.png" />


            <h3 className="mb-4 text-center">👤 Mon Profil</h3>

            <p>
                <strong>Nom :</strong> {user.lastName}
            </p>
            <p>
                <strong>Prénom :</strong> {user.firstName}
            </p>
            <p>
                <strong>Filière :</strong> {user.filiere || "Non renseignée"}
            </p>
            <p>
                <strong>Campus :</strong> {user.campus || "Non défini"}
            </p>
            <p>
                <strong>Niveau :</strong> {user.niveau || "Non renseigné"}
            </p>

            {/* 🔘 Actions */}
            <div className="text-center mt-4 d-flex flex-column align-items-center gap-2">
                <Button
                    variant="dark"
                    onClick={() => navigate("/profile/edit")}
                    disabled={deleting}
                >
                    ✏️ Modifier mon profil
                </Button>

                <Button variant="outline-danger" onClick={handleShow}>
                    🗑️ Supprimer mon compte
                </Button>
            </div>

            {/* 🧱 MODALE de confirmation de suppression */}
            <Modal show={showModal} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmer la suppression</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>
                        ⚠️ Es-tu sûr de vouloir supprimer ton compte ?<br />
                        Cette action est <strong>irréversible</strong> et supprimera toutes
                        tes données personnelles.
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Annuler
                    </Button>

                    <Button
                        variant="outline-danger"
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                    >
                        {deleting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                Suppression...
                            </>
                        ) : (
                            "Confirmer la suppression"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
