import Button from "@mui/material/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { logout } from "../utils/Auth";
import { useUserStorage } from "../utils/Storagelocal";
import { Link, useNavigate } from "react-router-dom";
import ThemeButton from "../components/Buttons/Theme";

function MyNavbar() {
  const user = useUserStorage();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

// 🔗 Liens disponibles pour tous
const publicLinks = [
  { name: "Accueil", path: "/" },
  { name: "À propos", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Confidentialité", path: "/privacy" },
];

// 🔗 Liens disponibles uniquement pour les utilisateurs connectés
const userLinks = [
  { name: "Profil", path: "/" },
  { name: "Rechercher", path: "/search" },
  { name: "Paramètres", path: "/settings" },
];


  return (
     <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container fluid>
        {/* --- LOGO / GAUCHE --- */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          CampusConnect
        </Navbar.Brand>

        {/* --- BOUTON BURGER --- */}
        <Navbar.Toggle aria-controls="main-navbar" />

        <Navbar.Collapse id="main-navbar">
          {/* --- LIENS À GAUCHE --- */}
          <Nav className="me-auto">
            {publicLinks.map((link, i) => (
              <Nav.Link
                as={Link}
                key={i}
                to={link.path}
                style={{ color: "white" }}
              >
                {link.name}
              </Nav.Link>
            ))}

            {user &&
              userLinks.map((link, i) => (
                <Nav.Link
                  as={Link}
                  key={i}
                  to={link.path}
                  style={{ color: "white" }}
                >
                  {link.name}
                </Nav.Link>
              ))}
          </Nav>

          {/* --- PROFIL / DROITE --- */}
          <div className="d-flex align-items-center">
            {user ? (
              <>
                {/* Nom utilisateur */}
                <span className="text-white me-3">
                  <strong>{user.firstName}</strong>
                </span>

                {/*Bouton Déconnexion */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                >
                  Déconnexion
                </Button>
                <ThemeButton/>
              </>
            ) : (<>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
              >
                Connexion
              </Button>
              <ThemeButton/>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
