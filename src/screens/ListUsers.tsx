import * as React from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";

import { ListUser, type User } from "../utils/ListUser";
import {
  SendRequestFriends,
  GetPendingFriends,
  GetAcceptedFriends,
} from "../utils/Friends";
import { InfoUser } from "../utils/Storagelocal";
import NotificationFriends from "../components/Notification";

function UsersListScreen() {
  const navigate = useNavigate();

  // 🔹 États
  const [users, setUsers] = React.useState<User[]>([]);
  const [pendingFriends, setPendingFriends] = React.useState<string[]>([]);
  const [acceptedFriends, setAcceptedFriends] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 🔹 Informations utilisateur actuel
  const currentUserId = InfoUser("userid")?.toString() || "";

  // Charger les utilisateurs et relations
  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      // 1️⃣ Charger tous les utilisateurs
      const allUsers = await ListUser();

      // 2️⃣ Charger les demandes d’amis en attente
      const pendingData = await GetPendingFriends(currentUserId);
      const pendingIds =
        pendingData?.amis?.map((u) => u.userId) || [];

      // 3️⃣ Charger les amis déjà acceptés
      const acceptedData = await GetAcceptedFriends(currentUserId);
      const acceptedIds =
        acceptedData?.amis?.map((u) => u.userId) || [];

      // 4️⃣ Mettre à jour les états
      setUsers(allUsers.filter((u) => u.userId !== currentUserId)); // exclure soi-même
      setPendingFriends(pendingIds);
      setAcceptedFriends(acceptedIds);
      setLoading(false);
    };

    fetchAll();
  }, [currentUserId]);

  // 🔹 Gestion de l'envoi de demande
  const handleAddFriend = async (receiverId: string) => {
    const res = await SendRequestFriends(currentUserId, receiverId);
    if (res.includes("succès")) {
      NotificationFriends({ status: "pending" });
      setPendingFriends([...pendingFriends, receiverId]);
    } else {
      NotificationFriends({ status: "error" });
    }
  };

  // 🔹 Chargement
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des utilisateurs...</p>
      </Container>
    );
  }

  // 🔹 Aucun utilisateur
  if (users.length === 0) {
    return (
      <Container className="text-center py-5">
        <h5>😕 Aucun autre utilisateur trouvé</h5>
      </Container>
    );
  }

  // 🔹 Affichage de la liste
  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">👥 Tous les utilisateurs</h3>
      <Row>
        {users.map((user) => (
          <Col md={4} key={user._id} className="mb-3">
            <Card className="text-center shadow-sm p-3">
              <Image
                src={
                  user.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                roundedCircle
                width="100"
                height="100"
                className="mb-3"
                style={{ objectFit: "cover" }}
              />
              <h5>
                {user.firstName} {user.lastName}
              </h5>
              <p className="text-muted">
                {user.filiere || "Étudiant"} – {user.niveau || ""}
              </p>
              <p className="text-muted">Campus : {user.campus || "?"}</p>

              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/profile/user/${user.userId}`)}
                >
                  Voir le profil
                </Button>

                {/* Bouton selon le statut */}
                {acceptedFriends.includes(user.userId) ? (
                  <Button variant="secondary" disabled>
                    ✅ Ami(e)
                  </Button>
                ) : pendingFriends.includes(user.userId) ? (
                  <Button variant="warning" disabled>
                    ⏳ En attente
                  </Button>
                ) : (
                  <Button
                    variant="success"
                    onClick={() => handleAddFriend(user.userId)}
                  >
                    ➕ Ajouter en ami
                  </Button>
                )}
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default UsersListScreen;
