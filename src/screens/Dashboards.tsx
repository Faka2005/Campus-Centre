import { useNavigate } from "react-router-dom";
import { Container, Button, Tab, Tabs } from "react-bootstrap";
import FriendsScreens from "./FriendsScreen";
import RequestFriend from "./RequestFriends";
import {  useUserStorage } from "../utils/Storagelocal";
import ProfilScreens from "./ProfilScreens";
function Dashboard() {
  const user = useUserStorage();
  const navigate = useNavigate();


  // 🧑 Si pas connecté
  if (!user) {
    return (
      <Container
        fluid
        className="text-center d-flex flex-column justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h2>Bienvenue sur CampusConnect 👋</h2>
        <p>Connectez-vous pour accéder à votre tableau de bord personnel.</p>
        <Button variant="primary" onClick={() => navigate("/login")}>
          Se connecter
        </Button>
      </Container>
    );
  }

  // 🧭 Interface principale
  return (
    <Container className="py-4">
      <Tabs defaultActiveKey="profile" id="dashboard-tabs" className="mb-5" fill>
        {/* 🧑 Profil */}
        <Tab eventKey="profile" title="Profil">
        <ProfilScreens />
        </Tab>

        {/* 🎓 Tuteurs */}
        <Tab eventKey="tuteur" title="Liste de tuteurs">
          <div className="p-3">Contenu : liste des tuteurs</div>
        </Tab>

        {/* 👥 Amis */}
        <Tab eventKey="amis" title="Liste d’amis">
          <div className="p-3">
            <FriendsScreens />
          </div>
        </Tab>

        {/* 💬 Messages */}
        <Tab eventKey="messages" title="Messages">
          <div className="p-3">Contenu : messages</div>
        </Tab>

        {/* 🤝 Demandes d’amis */}
        <Tab eventKey="demandes" title="Demandes d’amis">
          <div className="p-3">
            <RequestFriend />
          </div>
        </Tab>
      </Tabs>


    </Container>
  );
}

export default Dashboard;
