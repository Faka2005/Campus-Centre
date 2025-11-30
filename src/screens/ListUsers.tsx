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
import Notifications from "../components/Notification";
import { useUsersStatus } from "../utils/Auth";

function UsersListScreen() {
  const navigate = useNavigate();
  
  // 🔹 États
  const [users, setUsers] = React.useState<User[]>([]);
  const [pendingFriends, setPendingFriends] = React.useState<string[]>([]);
  const [acceptedFriends, setAcceptedFriends] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sendingRequestIds, setSendingRequestIds] = React.useState<string[]>([]);
  const status = useUsersStatus(users.map(u => u.userId));
  // 🔹 Utilisateur courant
  const currentUserId = InfoUser("userid")?.toString() || "";

  // 🔹 Charger les utilisateurs et relations
  React.useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const allUsers = await ListUser();
        const pendingData = await GetPendingFriends(currentUserId);
        const acceptedData = await GetAcceptedFriends(currentUserId);

        setUsers(allUsers.filter((u) => u.userId !== currentUserId));
        setPendingFriends(pendingData?.amis?.map((u) => u.userId) || []);
        setAcceptedFriends(acceptedData?.amis?.map((u) => u.userId) || []);
      } catch (err) {
        console.error(err);
        setError("Erreur lors du chargement des utilisateurs.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [currentUserId]);

  // 🔹 Gestion de l'envoi de demande
  const handleAddFriend = async (receiverId: string) => {
    console.log(receiverId)
    console.log(currentUserId)
    if (sendingRequestIds.includes(receiverId)) return;

    setSendingRequestIds((prev) => [...prev, receiverId]);
    try {
      const res = await SendRequestFriends(currentUserId, receiverId);
      if (res.includes("succès")) {
        Notifications({ status: "Demande envoyée !" });
        setPendingFriends((prev) =>
          prev.includes(receiverId) ? prev : [...prev, receiverId]
        );
      } else {
        Notifications({ status:"Impossible d’envoyer la demande." });
      }
    } catch (err) {
      console.error(err);
      Notifications({ status:  "Erreur réseau." });
    } finally {
      setSendingRequestIds((prev) => prev.filter((id) => id !== receiverId));
    }
  };

  // 🔹 Loading global
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

  // 🔹 Erreur
  if (error) {
    return (
      <Container className="py-5 text-center text-danger">
        <p>{error}</p>
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
        {users.map((user) => {
          const isAccepted = acceptedFriends.includes(user.userId);
          const isPending = pendingFriends.includes(user.userId);
          const isSending = sendingRequestIds.includes(user.userId);

          return (
<Col md={4} key={user._id} className="mb-3">
  <Card 
    className="text-center shadow-sm p-3"
    style={{ width: "18rem", height: "300px", position: "relative" }} // taille fixe
  >
    <div style={{ position: "relative", display: "inline-block" }}>
<Image
  src={user.photoUrl || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
  roundedCircle
  width="100"
  height="100"
  className="mb-3"
  style={{ objectFit: "cover" }}
/>
<span
  style={{
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 15,
    height: 15,
    borderRadius: "50%",
    backgroundColor: status[user.userId] ? "green" : "red",
    border: "2px solid white",
  }}
/>
      {/* Petit point de statut */}
      <span
        style={{
          position: "absolute",
          bottom: 5,
          right: 5,
          width: 15,
          height: 15,
          borderRadius: "50%",
          backgroundColor:status[user.userId] === true ? "green" : "red" ,
          border: "2px solid white",
        }}
      ></span>
    </div>

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
        aria-label={`Voir le profil de ${user.firstName} ${user.lastName}`}
      >
        Voir le profil
      </Button>

      {isAccepted ? (
        <Button variant="secondary" disabled>
          ✅ Ami(e)
        </Button>
      ) : isPending || isSending ? (
        <Button variant="warning" disabled>
          ⏳ {isSending ? "Envoi..." : "En attente"}
          {isSending && (
            <span className="spinner-border spinner-border-sm ms-2"></span>
          )}
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

          );
        })}
      </Row>
    </Container>
  );
}

export default UsersListScreen;
