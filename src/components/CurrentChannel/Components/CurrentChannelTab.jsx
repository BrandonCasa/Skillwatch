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
  const onClickFriend = (event, friendId) => {
    props.setMessages([]);
    let docRefA = props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`);
    let docRefB = props.database.collection("chatChannels").doc(`${friendId} - ${props.user.uid}`);

    docRefA.get().then((docA) => {
      if (docA.exists) {
        // If `${props.user.uid} - ${friendId}` DOES exist
        props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
        props.subToUsername(friendId, (theName) => {
          props.setChannelName(theName);

          props.database
            .collection("chatChannels")
            .doc(`${props.user.uid} - ${friendId}`)
            .onSnapshot((snapshot) => {
              if (snapshot.exists) {
                props.setMessages(snapshot.data().messages);
              }
            });
        });
      } else {
        // If `${props.user.uid} - ${friendId}` DOES NOT exist
        docRefB.get().then((docB) => {
          if (docB.exists) {
            // If `${friendId} - ${props.user.uid}` DOES exist
            props.setCurrentChannel(`${friendId} - ${props.user.uid}`);
            props.subToUsername(friendId, (theName) => {
              props.setChannelName(theName);
              props.database
                .collection("chatChannels")
                .doc(`${friendId} - ${props.user.uid}`)
                .onSnapshot((snapshot) => {
                  if (snapshot.exists) {
                    props.setMessages(snapshot.data().messages);
                  }
                });
            });
          } else {
            // If `${friendId} - ${props.user.uid}` DOES NOT exist
            props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`).set({ messages: [] });
            props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
            props.subToUsername(friendId, (theName) => {
              props.setChannelName(theName);
              props.database
                .collection("chatChannels")
                .doc(`${props.user.uid} - ${friendId}`)
                .onSnapshot((snapshot) => {
                  if (snapshot.exists) {
                    props.setMessages(snapshot.data().messages);
                  }
                });
            });
          }
        });
      }
    });
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setMessages([]);
    props.setCurrentChannel(channelName);
    props.setChannelName(channelName);
    props.database
      .collection("chatChannels")
      .doc(channelName)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          props.setMessages(snapshot.data().messages);
        }
      });
  };

  React.useEffect(() => {
    if (props.currentChannel === "Region") {
      props.database
        .collection("chatChannels")
        .doc("Region")
        .get()
        .then((snapshot) => {
          props.setMessages(snapshot.data().messages);
        });
    }
  }, []);

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
  const [theUsername, setTheUsername] = React.useState(props.message.sender === props.user.uid ? props.username : props.usernameMap[props.message.sender]);

  if (props.message.channel === props.currentChannel) {
    if (props.message.sender !== props.user.uid && !props.usernameMap.hasOwnProperty(props.message.sender)) {
      props.subToUsername(props.message.sender, (theName) => {
        setTheUsername(theName);
      });
    }

    if (props.hasDivider) {
      return (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={theUsername} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText primary={theUsername} secondary={<React.Fragment>{props.message.messageContent}</React.Fragment>} />
          </ListItem>

          <Divider variant="inset" component="li" />
        </>
      );
    } else {
      return (
        <>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={theUsername} src="/static/images/avatar/1.jpg" />
            </ListItemAvatar>
            <ListItemText primary={theUsername} secondary={<React.Fragment>{props.message.messageContent}</React.Fragment>} />
          </ListItem>
        </>
      );
    }
  } else {
    return "";
  }
}

function CurrentChannelTab(props) {
  const [messages, setMessages] = React.useState([]);

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

  const sendMessage = () => {
    let inputBox = document.getElementById("InputBox");
    props.database
      .collection("chatChannels")
      .doc(props.currentChannel)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          let oldMessages = docSnapshot.data().messages;
          oldMessages.push({ sender: props.user.uid, messageContent: inputBox.value, channel: props.currentChannel });
          props.database
            .collection("chatChannels")
            .doc(props.currentChannel)
            .update({
              messages: oldMessages,
            })
            .then(() => {
              console.log(`Successfully sent message.`);
              inputBox.value = "";
            })
            .catch((error) => {
              console.error("Error sending message", error);
            });
        }
      });
  };

  return (
    <div className="CurrentChannel-Content">
      <div className="CurrentChannel-Chat">
        <Paper className="CurrentChannel-ChatPaper" variant="outlined">
          <ListSubheader component="div">Channel History: ({props.channelName})</ListSubheader>
          <Divider />
          <div className="CurrentChannel-ChatWindow">
            <List className="CurrentChannel-ChatList">
              {messages.map((message, id) => {
                return <Message subToUsername={subToUsername} key={id} message={message} {...props} />;
              })}
            </List>
            <Paper className="CurrentChannel-ChatInput" variant="outlined">
              <IconButton className="CurrentChannel-AddButton" color="secondary">
                <AddIcon />
              </IconButton>
              <TextField id="InputBox" size="small" placeholder="Message" className="CurrentChannel-ChatTextField" color="secondary" fullWidth />
              <IconButton className="CurrentChannel-SendButton" color="secondary" onClick={sendMessage}>
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
            <Channels setMessages={setMessages} subToUsername={subToUsername} {...props} />
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default CurrentChannelTab;
