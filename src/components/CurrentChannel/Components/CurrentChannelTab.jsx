import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import SendIcon from "@material-ui/icons/Send";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import AddIcon from "@material-ui/icons/Add";
// SCSS
import "./CurrentChannelTab.scss";
// Custom Components
import FriendChannel from "./FriendChannel";
import PublicChannel from "./PublicChannel";

function Channels(props) {
  const onClickFriend = (event, friendId) => {
    props.setCurrentChannel(friendId);
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setCurrentChannel(channelName);
  };

  return (
    <>
      <PublicChannel channelName={"Region"} selected={props.currentChannel === "Region"} clicky={onClickPublicChannel} />
      {props.friends.map((friendId, id) => (
        <FriendChannel theKey={id} selected={props.currentChannel === friendId || (id === 0 && props.currentChannel === "")} friendId={friendId} key={id} clicky={onClickFriend} {...props} />
      ))}
      {props.friends.length === -1 && "Go add some friends!"}
    </>
  );
}

function Username(props) {
  const [username, setUsername] = React.useState("");

  let userId = "";
  userId = userId + props.friendId;

  if (userId === "Region") {
    return "Region";
  } else if (userId !== "") {
    props.database
      .collection("users")
      .doc(userId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("username") && snapshot.data().username !== props.friendId) {
            setUsername(snapshot.data().username);
          }
        }
      });
  }

  return username;
}

function CurrentChannelTab(props) {
  return (
    <div className="CurrentChannel-Content">
      <div className="CurrentChannel-Chat">
        <Paper className="CurrentChannel-ChatPaper" variant="outlined">
          <ListSubheader component="div">
            Channel History: (<Username friendId={props.currentChannel} {...props} />)
          </ListSubheader>
          <Divider />
          <div className="CurrentChannel-ChatWindow">
            <List className="CurrentChannel-ChatList">xd</List>
            <Paper className="CurrentChannel-ChatInput" variant="outlined">
              <IconButton className="CurrentChannel-AddButton" color="secondary">
                <AddIcon />
              </IconButton>
              <TextField size="small" placeholder="Message" className="CurrentChannel-ChatTextField" color="secondary" fullWidth />
              <IconButton className="CurrentChannel-SendButton" color="secondary">
                <SendIcon />
              </IconButton>
            </Paper>
          </div>
        </Paper>
      </div>
      <div className="CurrentChannel-RightBar">
        <Paper className="CurrentChannel-SearchPaper" variant="outlined">
          <ListSubheader component="div">{`Channel Search`}</ListSubheader>
          <Divider />
          <div className="CurrentChannel-SearchContent">
            <TextField
              label="Search"
              color="secondary"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton className="CurrentChannel-SearchButton">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
        </Paper>
        <Paper className="CurrentChannel-SelectPaper" variant="outlined">
          <ListSubheader component="div">{`Channel Select`}</ListSubheader>
          <Divider />
          <List>
            <Channels {...props} />
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default CurrentChannelTab;
