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
  const subToUsername = (friendId, callback) => {
    if (!props.usernameMap.hasOwnProperty(friendId)) {
      props.database
        .collection("users")
        .doc(friendId)
        .onSnapshot((snapshot) => {
          if (snapshot.exists && snapshot.data().username !== props.usernameMap[friendId]) {
            if (props.channelName === props.usernameMap[friendId]) {
              props.setChannelName(snapshot.data().username);
            }

            let oldUsernameMap = props.usernameMap;
            oldUsernameMap[friendId] = snapshot.data().username;
            props.setUsernameMap(oldUsernameMap);
            callback(snapshot.data().username);
          }
        });
    } else {
      callback(props.usernameMap[friendId]);
    }
  };

  const onClickFriend = (event, friendId) => {
    let docRefA = props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`);
    let docRefB = props.database.collection("chatChannels").doc(`${friendId} - ${props.user.uid}`);

    docRefA.get().then((docA) => {
      if (docA.exists) {
        // If `${props.user.uid} - ${friendId}` DOES exist
        props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
        subToUsername(friendId, (theName) => {
          props.setChannelName(theName);
        });
      } else {
        // If `${props.user.uid} - ${friendId}` DOES NOT exist
        docRefB.get().then((docB) => {
          if (docB.exists) {
            // If `${friendId} - ${props.user.uid}` DOES exist
            props.setCurrentChannel(`${friendId} - ${props.user.uid}`);
            subToUsername(friendId, (theName) => {
              props.setChannelName(theName);
            });
          } else {
            // If `${friendId} - ${props.user.uid}` DOES NOT exist
            props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`).set({ messages: [] });
            props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
            subToUsername(friendId, (theName) => {
              props.setChannelName(theName);
            });
          }
        });
      }
    });
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setCurrentChannel(channelName);
    props.setChannelName(channelName);
  };

  return (
    <>
      <PublicChannel
        channelName={"Region"}
        selected={props.currentChannel === "Region"}
        clicky={(event) => {
          onClickPublicChannel(event, "Region");
        }}
      />
      {props.friends.map((friendId, id) => (
        <FriendChannel
          theKey={id}
          selected={props.currentChannel === `${props.user.uid} - ${friendId}` || props.currentChannel === `${friendId} - ${props.user.uid}`}
          friendId={friendId}
          key={id}
          clicky={(event) => {
            onClickFriend(event, friendId);
          }}
          {...props}
        />
      ))}
      {props.friends.length === -1 && "Go add some friends!"}
    </>
  );
}

function Message(props) {
  let senderName = "";
  if (props.message.sender === props.user.uid) {
    senderName = props.username;
  } else {
    props.saveUsername(props.message.sender);
    senderName = props.usernameMap[props.message.sender];
  }

  if (props.hasDivider) {
    return (
      <>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={senderName} src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText primary={senderName} secondary={<React.Fragment>{props.message.messageContent}</React.Fragment>} />
        </ListItem>

        <Divider variant="inset" component="li" />
      </>
    );
  } else {
    return (
      <>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={senderName} src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText primary={senderName} secondary={<React.Fragment>{props.message.messageContent}</React.Fragment>} />
        </ListItem>
      </>
    );
  }
}

function CurrentChannelTab(props) {
  return (
    <div className="CurrentChannel-Content">
      <div className="CurrentChannel-Chat">
        <Paper className="CurrentChannel-ChatPaper" variant="outlined">
          <ListSubheader component="div">Channel History: ({props.channelName})</ListSubheader>
          <Divider />
          <div className="CurrentChannel-ChatWindow">
            <List className="CurrentChannel-ChatList"></List>
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
            <Channels setChannelName={props.setChannelName} channelName={props.channelName} {...props} />
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default CurrentChannelTab;
