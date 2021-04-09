import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import randomUsernameGen from "random-username-generator";
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
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";

// SCSS
import "./CurrentChannelTab.scss";
// Custom Components
import FriendChannel from "./FriendChannel";
import PublicChannel from "./PublicChannel";

function Channels(props) {
  const onClickFriend = (event, friendId) => {
    props.setCurrentChannel(friendId);
    props.onChangeChannel(friendId);
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setCurrentChannel(channelName);
    props.onChangeChannel("PUBLIC:Region");
  };

  React.useEffect(() => {
    props.onChangeChannel("PUBLIC:Region");
  }, []);

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

function Message(props) {}

function CurrentChannelTab(props) {
  const [usernameMap, setUsernameMap] = React.useState({});
  const [currentChannelName, setCurrentChannelName] = React.useState("");

  const changeChannel = (id) => {
    if (!id.startsWith("PUBLIC:")) {
      let friendId = id;
      if (usernameMap.hasOwnProperty(friendId)) {
        setCurrentChannelName(usernameMap[friendId]);
      } else {
        props.database
          .collection("users")
          .doc(friendId)
          .onSnapshot((docSnapshot) => {
            let usernameMapSub = usernameMap;
            if (docSnapshot.data().username !== friendId) {
              usernameMapSub[friendId] = docSnapshot.data().username;
              setUsernameMap(usernameMapSub);
              setCurrentChannelName(docSnapshot.data().username);
            } else {
              let randName = randomUsernameGen.generate();
              usernameMapSub[friendId] = randName;
              setUsernameMap(usernameMapSub);
              setCurrentChannelName(randName);
            }
          });
      }
    } else {
      let channelName = id.replace("PUBLIC:", "");
      setCurrentChannelName(channelName);
    }
  };

  return (
    <div className="CurrentChannel-Content">
      <div className="CurrentChannel-Chat">
        <Paper className="CurrentChannel-ChatPaper" variant="outlined">
          <ListSubheader component="div">Channel History: ({currentChannelName})</ListSubheader>
          <Divider />
          <div className="CurrentChannel-ChatWindow">
            <List className="CurrentChannel-ChatList">
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                </ListItemAvatar>
                <ListItemText primary="Sender" secondary={<React.Fragment>{"I'll be in your neighborhood doing errands this weekend."}</React.Fragment>} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
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
            <Channels onChangeChannel={changeChannel} {...props} />
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default CurrentChannelTab;
