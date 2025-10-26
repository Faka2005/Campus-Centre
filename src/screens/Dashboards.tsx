import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import { useUserStorage } from "../utils/Storagelocal";
import { useNavigate } from "react-router-dom";
import { CountFriends } from "../utils/Friends";
import { InfoUser } from "../utils/Storagelocal";
import * as React from "react";

function Dashboard() {
    const user = useUserStorage();
    const navigate = useNavigate();
    const [count, setCount] = React.useState<number>(0);
    const userId = InfoUser("userid")?.toString();

    React.useEffect(() => {
        if (userId) {
            CountFriends(userId).then(setCount);
        }
    }, [userId]);
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
        <Container fluid className="py-4">
            <h2 className="text-center mb-4">
                Bonjour, <strong>{user.firstName}</strong> 👋
            </h2>

            <Row className="mb-4">
                {/* Colonne profil utilisateur */}
                <Col md={4}>
                    <Card className="shadow-sm text-center p-3">
                        <Image
                            src={
                                user.photoUrl ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            roundedCircle
                            width="120"
                            height="120"
                            style={{ objectFit: "cover", marginBottom: "10px" }}
                        />
                        <h4>
                            {user.firstName} {user.lastName}
                        </h4>
                        <p className="text-muted">{user.filiere || "Étudiant"}</p>
                        <Button
                            variant="outline-primary"
                            className="mt-2"
                            onClick={() => navigate("/profile")}
                        >
                            Voir le profil
                        </Button>
                    </Card>
                </Col>

                {/* Colonne Statistiques */}
                <Col md={8}>
                    <Row>
                        <Col md={6}>
                            <Card className="shadow-sm text-center p-3 mb-3">
                                <h5>Amis</h5>
                                <p className="display-6">{count}</p>
                                <Button
                                    variant="outline-primary"
                                    className="mt-2"
                                    onClick={() => navigate(`/friend/user/${user.userId}`)}
                                >
                                    Voir la liste des amis
                                </Button>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm text-center p-3 mb-3">
                                <h5>Tuteurs suivis</h5>
                                <p className="display-6">5</p>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            <Card className="shadow-sm text-center p-3 mb-3">
                                <h5>Campus</h5>
                                <p>{user.campus || "Non défini"}</p>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="shadow-sm text-center p-3 mb-3">
                                <h5>Niveau</h5>
                                <p>{user.niveau || "Non renseigné"}</p>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card className="shadow-sm p-4">
                        <h5>Centres d’intérêt</h5>
                        {user.interests && user.interests.length > 0 ? (
                            <ul>
                                {user.interests.map((interest, i) => (
                                    <li key={i}>{interest}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted">
                                Vous n’avez pas encore défini vos centres d’intérêt.
                            </p>
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;
