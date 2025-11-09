import { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Message from "./Message";
import FriendList from "./FriendList";

export default function ChatBox() {
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null);

  return (
    <Container>
      <Row>
        {/* Liste des amis */}
        <Col
          xs={12}
          md={4}
          style={{ borderRight: "1px solid #ddd", height: "80vh", overflowY: "auto" }}
        >
          <FriendList onSelectFriend={(id) => setSelectedFriendId(id)} />
        </Col>

        {/* Conversation */}
        <Col xs={12} md={8} style={{ height: "80vh", overflowY: "auto" }}>
          <Message idFriend={selectedFriendId} />
        </Col>
      </Row>
    </Container>
  );
}
