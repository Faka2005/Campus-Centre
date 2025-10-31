import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import FriendsScreens from "./FriendsScreen";
import { useUserStorage } from "../utils/Storagelocal";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import RequestFriend from "./RequestFriends";
// (Futurs imports)
// import TuteurList from "./TuteurList";
// import DemandeAmi from "./DemandeAmi";
// import MessagesScreen from "./MessagesScreen";

function Dashboard() {
  const user = useUserStorage();
  const navigate = useNavigate();

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

  return (
    <Container className="py-4">

      <Tabs defaultActiveKey="profile" id="dashboard-tabs" className="mb-5" fill>
        {/* 🧑 Profil */}
        <Tab eventKey="profile" title="Profil">
          <div className="p-3">
            <p>
              Nom : <strong>{user.firstName} {user.lastName}</strong>
            </p>

                <TextField
          id="filled-helperText"
          label="Helper text"
                    defaultValue={user.firstName}
          helperText="Moifier votre Prénom"
          variant="filled"
        />
            <p>Filière : {user.filiere || "Non renseignée"}</p>
            <p>Campus : {user.campus || "Non défini"}</p>
            <p>Niveau : {user.niveau || "Non renseigné"}</p>
          </div>
        </Tab>

        {/* 🎓 Tuteurs */}
        <Tab eventKey="tuteur" title="Liste de tuteurs">
          <div className="p-3">Contenu : liste des tuteurs</div>
          {/* <TuteurList /> */}
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
          {/* <MessagesScreen /> */}
        </Tab>

        {/* 🤝 Demandes d’amis */}
        <Tab eventKey="demandes" title="Demandes d’amis">
          <div className="p-3">Contenu : demandes d’amis</div>
          <RequestFriend />
        </Tab>
      </Tabs>
    </Container>
  );
}

export default Dashboard;

