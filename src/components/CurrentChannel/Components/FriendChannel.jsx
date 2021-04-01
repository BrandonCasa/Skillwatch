import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import PersonIcon from "@material-ui/icons/Person";
// SCSS
import "./FriendChannel.scss";

function FriendChannel(props) {
  const [status, setStatus] = React.useState(false);
  const [pfpBlob, setPfpBlob] = React.useState("");
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.friendId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("status")) {
            setStatus(snapshot.data().status);
          }
          if (snapshot.data().hasOwnProperty("pfp")) {
            setPfpBlob(snapshot.data().pfp);
          }
          if (snapshot.data().hasOwnProperty("username") && snapshot.data().username !== props.friendId) {
            setUsername(snapshot.data().username);
          }
        }
      });
  }, []);

  return (
    <ListItem
      button
      className="FriendChannel-Content"
      selected={props.selected}
      onClick={(event) => {
        props.clicky(event, props.friendId);
      }}
    >
      <ListItemIcon>
        <Badge
          className={`Badge Badge-${status}`}
          variant="dot"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <div>
            <Avatar src={pfpBlob}>
              <PersonIcon className="PersonIcon" />
            </Avatar>
          </div>
        </Badge>
      </ListItemIcon>
      <ListItemText primary={username} />
    </ListItem>
  );
}

export default FriendChannel;
