import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStorage, InfoUser } from "../utils/Storagelocal";
import { GetAcceptedFriends } from "../utils/Friends";
import type { FriendsUser } from "../utils/Friends";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { RemoveFriend } from "../utils/Friends";
function FriendsScreens() {
  const user = useUserStorage();
  const navigate = useNavigate();
  const [friends, setFriends] = React.useState<FriendsUser["amis"]>([]);
  const [loading, setLoading] = React.useState(true);

  // 🔹 Récupération de l’ID depuis le localStorage (comme dans Dashboard)
  const userId = InfoUser("userid")?.toString();

  React.useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      setLoading(true);
      const data = await GetAcceptedFriends(userId);
      if (data && data.amis) setFriends(data.amis);
      setLoading(false);
    };

    fetchFriends();
  }, [userId]);

  // 🔹 Si utilisateur non connecté
  if (!user) {
    return (
      <Container className="text-center py-5">
        <h4>Veuillez vous connecter pour voir votre liste d’amis.</h4>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Se connecter
        </Button>
      </Container>
    );
  }

  // 🔹 Chargement
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des amis...</p>
      </Container>
    );
  }

  // 🔹 Aucun ami trouvé
  if (friends.length === 0) {
    return (
      <Container className="text-center py-5">
        <h5>😕 Vous n’avez pas encore d’amis</h5>
        <Button variant="primary" onClick={() => navigate("/search")}>
          Rechercher des amis
        </Button>
      </Container>
    );
  }

  // 🔹 Affichage de la liste d’amis
  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">👥 Liste d’amis</h3>
      <Row>
        {friends.map((friend) => (
          <Col md={4} key={friend._id} className="mb-3">
            <Card className="text-center shadow-sm p-3">
              <Image
                src={
                  friend.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                roundedCircle
                width="100"
                height="100"
                className="mb-3"
                style={{ objectFit: "cover" }}
              />
              <h5>
                {friend.firstName} {friend.lastName}
              </h5>
              <p className="text-muted">{friend.filiere || "Étudiant"}</p>
              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="outline-primary"
                  onClick={() => navigate(`/profile/user/${friend.userId}`)}
                >
                  Voir le profil
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => navigate(`/messages/${friend.userId}`)}
                >
                  Message
                </Button>
                  <Button
                  variant="outline-danger"
                  color="secondary"
                  onClick={() => RemoveFriend(userId!, friend.userId)}
                >
                  Supprimer des amis
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default FriendsScreens;
