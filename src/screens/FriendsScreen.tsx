import * as React from "react";
import { useParams } from "react-router-dom";
import { GetFriendsUser } from "../utils/Friends";
import type{ FriendsUser } from "../utils/Friends";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function FriendsScreens() {
  const { userid } = useParams<{ userid: string }>();
  const [friends, setFriends] = React.useState<FriendsUser["amis"]>([]);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => {
    if (!userid) return;

    const fetchFriends = async () => {
      setLoading(true);
      const data = await GetFriendsUser(userid);
      if (data && data.amis) {
        setFriends(data.amis);
      }
      setLoading(false);
    };

    fetchFriends();
  }, [userid]);

  if (!userid) {
    return <p>Utilisateur invalide</p>;
  }

  if (loading) {
    return <p>Chargement des amis...</p>;
  }

  if (friends.length === 0) {
    return <p>Aucun ami trouvé pour cet utilisateur.</p>;
  }

  return (
    <Container className="py-4">
      <h3>Liste d'amis </h3>
      <Row>
        {friends.map((friend) => (
          <Col md={4} key={friend._id} className="mb-3">
            <Card className="text-center p-3 shadow-sm">
              <img
                src={
                  friend.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={`${friend.firstName} ${friend.lastName}`}
                className="rounded-circle mb-2"
                width={100}
                height={100}
                style={{ objectFit: "cover" }}
              />
              <h5>{friend.firstName} {friend.lastName}</h5>
              <p className="text-muted">{friend.filiere || "Étudiant"}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
