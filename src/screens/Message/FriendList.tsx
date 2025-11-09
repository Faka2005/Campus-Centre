import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useUserStorage, InfoUser } from "../../utils/Storagelocal";
import { GetAcceptedFriends } from "../../utils/Friends";
import type { FriendsUser } from "../../utils/Friends";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Badge from "@mui/material/Badge";

export default function FriendList({
  onSelectFriend,
}: {
  onSelectFriend: (id: string) => void;
}) {
  const user = useUserStorage();
  const [friends, setFriends] = React.useState<FriendsUser["amis"]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");

  const userId = InfoUser("userid")?.toString();

  React.useEffect(() => {
    if (!userId) return;

    const fetchFriends = async () => {
      setLoading(true);
      const data = await GetAcceptedFriends(userId);
      if (data && data.amis) setFriends(data.amis);
      setLoading(false);
    };

    fetchFriends();
  }, [userId]);

  if (!user) {
    return (
      <Container className="text-center py-5">
        <h4>Veuillez vous connecter pour voir vos messages.</h4>
        <Button variant="primary">Se connecter</Button>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p>Chargement des amis...</p>
      </Container>
    );
  }

  if (friends.length === 0) {
    return (
      <Container className="text-center py-5">
        <h5>😕 Vous n’avez pas encore d’amis</h5>
        <Button variant="primary">Rechercher des amis</Button>
      </Container>
    );
  }

  const filteredFriends = friends.filter((f) =>
    (f.firstName + " " + f.lastName).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "flex-end", p: 1 }}>
        <SearchOutlinedIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          label="Rechercher un ami"
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
      </Box>

      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {filteredFriends.map((friend) => (
          <React.Fragment key={friend.userId}>
            <ListItem
              alignItems="flex-start"
              onClick={() => onSelectFriend(friend.userId)}
              sx={{ cursor: "pointer" }}
            >
              <ListItemAvatar>
                <Badge
                  color="success"
                  variant="dot"
                  overlap="circular"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                >
                  <Avatar src={friend.photoUrl || "/static/images/avatar/1.jpg"} />
                </Badge>
              </ListItemAvatar>

              <ListItemText
                primary={`${friend.firstName} ${friend.lastName}`}
                secondary={
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Dernier message ici...
                  </Typography>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </>
  );
}
