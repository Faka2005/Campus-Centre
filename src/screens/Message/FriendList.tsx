import * as React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useUserStorage, InfoUser } from "../../utils/Storagelocal";
import { GetAcceptedFriends } from "../../utils/Friends";
import type { ApiLogin } from "../../utils/Storagelocal";

interface FriendListProps {
  onSelectFriend: (id: string) => void;
}

export default function FriendList({ onSelectFriend }: FriendListProps) {
  const user = useUserStorage();
  const [friends, setFriends] = React.useState<ApiLogin[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  // ✅ Convertir le résultat en string si nécessaire
  const userIdRaw = InfoUser("userid") ?? user?.userId;
  const userId = typeof userIdRaw === "string" ? userIdRaw : undefined;

  React.useEffect(() => {
    if (!userId) return;

    (async () => {
      setLoading(true);
      try {
        const data = await GetAcceptedFriends(userId);
        // ✅ Vérifier que data n’est pas null avant d’accéder à amis
        if (data && Array.isArray(data.amis)) {
          setFriends(data.amis);
        } else {
          setFriends([]);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des amis :", err);
        setFriends([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  if (!user)
    return (
      <Container className="text-center py-5">
        <h4>Veuillez vous connecter pour voir vos messages.</h4>
        <Button variant="primary">Se connecter</Button>
      </Container>
    );

  if (loading)
    return (
      <Container className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des amis...</p>
      </Container>
    );

  const filteredFriends = friends.filter((f) =>
    `${f.firstName} ${f.lastName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <div style={{ margin: "10px 0" }}>
        <input
          type="text"
          placeholder="Rechercher un ami..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {filteredFriends.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>Aucun ami trouvé</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {filteredFriends.map((friend) => (
            <li
              key={friend.userId}
              onClick={() => onSelectFriend(friend.userId)}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
            >
              {friend.firstName} {friend.lastName}
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
