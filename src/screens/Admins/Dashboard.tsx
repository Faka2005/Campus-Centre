import { Container, Tabs, Tab } from "react-bootstrap";
import SignalementScreen from "./Signalement";
export default function DashboardAdmin() {
    return (
        <Container className="py-4">
          <Tabs defaultActiveKey="profile" id="dashboard-tabs" className="mb-5" fill>
            {/* 🧑 Profil */}
            <Tab eventKey="profile" title="Profil">
            </Tab>
    
            {/* 🎓 Tuteurs */}
            <Tab eventKey="utilisateur" title="Liste des utilisateurs">
              <div className="p-3">Contenu : liste des tuteurs</div>
            </Tab>
    
            {/* 👥 Amis */}
            <Tab eventKey="signalement" title="Liste des signalement">
              <div className="p-3">
                Contenu : liste des signalements
                <SignalementScreen />
              </div>
            </Tab>
    
            {/* 💬 Messages */}
            <Tab eventKey="messages" title="Messages" >
            </Tab>
    
            {/* 🤝 Demandes d’amis */}
            <Tab eventKey="demandes" title="Demandes d’amis">
              <div className="p-3">
              </div>
            </Tab>
          </Tabs>
    
    
        </Container>
      );
}