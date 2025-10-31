import * as React from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { InfoUser, type ApiLogin } from "../utils/Storagelocal";
import { GetPendingFriends, AcceptFriendRequest, RefuseFriendRequest } from "../utils/Friends";
import NotificationFriends from "../components/Notification";
import { toast } from "react-toastify";


function RequestFriend() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<ApiLogin[]>([]);
  const userId = InfoUser("userid")?.toString() || "";

  /**
   * 🔁 Récupère les demandes d'amis en attente
   */
  const fetchRequests = React.useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const data = await GetPendingFriends(userId);
      const pending = data?.amis || [];
      setRequests(pending);
    } catch (error) {
      console.error("Erreur lors du chargement des demandes :", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  /**
   * 🧠 Charge les demandes dès le montage
   */
  React.useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  /**
   * 🔔 Vérifie périodiquement les nouvelles demandes
   */
  React.useEffect(() => {
    const checkNewRequests = async () => {
      if (!userId) return;

      const data = await GetPendingFriends(userId);
      const currentIds = data?.amis?.map((u) => u.userId) || [];

      const previous = JSON.parse(localStorage.getItem("pendingRequests") || "[]");
      const newOnes = currentIds.filter((id) => !previous.includes(id));

      if (newOnes.length > 0) {
        NotificationFriends({ status: "newRequest" });
        await fetchRequests();
      }

      localStorage.setItem("pendingRequests", JSON.stringify(currentIds));
    };

    checkNewRequests(); // Vérifie immédiatement au chargement

    const interval = setInterval(checkNewRequests, 20000); // toutes les 20 sec
    return () => clearInterval(interval);
  }, [userId, fetchRequests]);

  /**
   * ⏳ Si en cours de chargement
   */
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p>Chargement des demandes d’amis...</p>
      </Container>
    );
  }

  /**
   * 😕 Si aucune demande reçue
   */
  if (requests.length === 0) {
    return (
      <Container className="text-center py-5">
        <h5>😕 Aucune demande d’ami reçue</h5>
      </Container>
    );
  }

  /**
   * 🎨 Affichage de la liste des demandes
   */
  return (
    <Container className="py-4">
      <h3 className="text-center mb-4">📨 Demandes d’amis reçues</h3>
      <Row>
        {requests.map((user) => (
          <Col md={4} key={user.userId} className="mb-3">
            <Card className="p-3 text-center shadow-sm">
              <img
                src={
                  user.photoUrl ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt={user.firstName}
                width="100"
                height="100"
                className="rounded-circle mx-auto mb-3"
                style={{ objectFit: "cover" }}
              />
              <h5>
                {user.firstName} {user.lastName}
              </h5>
              <p className="text-muted">
                {user.filiere || "Étudiant"} – {user.niveau || ""}
              </p>

              <div className="d-flex justify-content-center gap-2">
                <Button
                  variant="success"
                  onClick={async () => {
                    await AcceptFriendRequest(user.userId, userId);
                    toast.success(`✅ ${user.firstName} est maintenant ton ami !`);
                    window.location.reload();
                    fetchRequests();
                  }}
                >
                  Accepter
                </Button>

                <Button
                  variant="outline-danger"
                  onClick={async () => {
                    await RefuseFriendRequest(user.userId, userId);
                    toast.info(`❌ Demande de ${user.firstName} refusée`);
                    window.location.reload();

                    fetchRequests();
                  }}
                >
                  Refuser
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default RequestFriend;
