import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import FriendList from "./FriendList";
import Message from "./Message";
import * as React from "react";


export default function ChatBox() {
  const [selectedFriendId, setSelectedFriendId] = React.useState<string | null>(null);


  return (
    <Container fluid>
      <Row style={{ height: "80vh" }}>
        <Col xs={12} md={4} style={{ borderRight: "1px solid #ddd", overflowY: "auto", padding: 0 }}>
          <FriendList onSelectFriend={setSelectedFriendId} />
        </Col>
        <Col xs={12} md={8} style={{ overflowY: "auto", padding: 0 }}>
          <Message idFriend={selectedFriendId} />
        </Col>
      </Row>
    </Container>
  );
}