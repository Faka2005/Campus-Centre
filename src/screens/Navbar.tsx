import Button from "@mui/material/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import { logout } from "../utils/Auth";
import { useUserStorage } from "../utils/Storagelocal";
import { Link, useNavigate } from "react-router-dom";

function MyNavbar() {
  const user = useUserStorage();
  const navigate = useNavigate();

  const gender = user?.sexe === "male" ? "Monsieur" : "Madame";

  const handleLogout = () => {
    logout();
    window.location.reload()
    navigate("/", { replace: true });
  };
  return (
    <Navbar bg="dark" variant="dark" expand="xl">
      <Container>
        <Navbar.Brand as={Link} to="/">
          CampusConnect
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end d-flex align-items-center">
          {user ? (
            <>
              {/* Photo de profil */}
              <Link to="/profile">
                <Image
                  src={
                    user.photoUrl || //Image de l'utilisateur
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png" // Image par défaut    
                } 
                  roundedCircle
                  width="40"
                  height="40"
                  style={{
                    objectFit: "cover",
                    marginRight: "10px",
                    border: "2px solid white",
                  }}
                />
              </Link>

              <Navbar.Text className="text-white">
                Bienvenue{" "}
                <strong>
                  <Link
                    to="/profile"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    {gender} {user.lastName} {user.firstName}
                  </Link>
                </strong>
              </Navbar.Text>

              <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
                style={{ marginLeft: "10px" }}
              >
                Se déconnecter
              </Button>
            </>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.location.reload()}
            >
              Connexion
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default MyNavbar;
