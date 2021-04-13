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
    let docRefA = props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`);
    let docRefB = props.database.collection("chatChannels").doc(`${friendId} - ${props.user.uid}`);

    docRefA.get().then((docA) => {
      if (docA.exists) {
        // If `${props.user.uid} - ${friendId}` DOES exist
        props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
      } else {
        // If `${props.user.uid} - ${friendId}` DOES NOT exist
        docRefB.get().then((docB) => {
          if (docB.exists) {
            // If `${friendId} - ${props.user.uid}` DOES exist
            props.setCurrentChannel(`${friendId} - ${props.user.uid}`);
          } else {
            // If `${friendId} - ${props.user.uid}` DOES NOT exist
            props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`).set({ messages: [] });
            props.setCurrentChannel(`${props.user.uid} - ${friendId}`);
          }
        });
      }
    });
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setCurrentChannel(channelName);
  };

  return (
    <>
      <PublicChannel
        channelName={"Region"}
        selected={props.currentChannelId === "Region"}
        clicky={(event) => {
          onClickPublicChannel(event, "Region");
        }}
      />
      {props.friends.map((friendId, id) => (
        <FriendChannel
          theKey={id}
          selected={props.currentChannelId === `${props.user.uid} - ${friendId}` || props.currentChannel === `${friendId} - ${props.user.uid}`}
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
  const [username, setUsername] = React.useState("ERROR");
  const [pfpBlob, setPfpBlob] = React.useState("");

  props.database
    .collection("users")
    .doc(props.thisMessage.sender)
    .onSnapshot((snapshot) => {
      if (snapshot.exists) {
        if (username !== snapshot.data().username) {
          setUsername(snapshot.data().username);
        }
        if (pfpBlob !== snapshot.data().pfp) {
          setPfpBlob(snapshot.data().pfp);
        }
      }
    });

  if (props.id === props.messages.length) {
    return (
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={username} src={pfpBlob} />
        </ListItemAvatar>
        <ListItemText primary={username} secondary={<React.Fragment>{props.thisMessage.messageContent}</React.Fragment>} />
      </ListItem>
    );
  } else {
    return (
      <>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={username} src={pfpBlob} />
          </ListItemAvatar>
          <ListItemText primary={username} secondary={<React.Fragment>{props.thisMessage.messageContent}</React.Fragment>} />
        </ListItem>

        <Divider variant="inset" component="li" />
      </>
    );
  }
}

class CurrentChannelTabPog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
    this.state.currentChannelId = "Region";
    this.state.currentChannelName = "Region";
    this.state.channelMessages = { Region: [] };
  }

  componentDidMount() {
    this.props.database
      .collection("chatChannels")
      .doc("Region")
      .onSnapshot((snapshotChat) => {
        if (snapshotChat.exists) {
          let oldChannelMessages = this.state.channelMessages;
          if (document.getElementsByClassName("CurrentChannel-ChatList")[0] !== undefined) {
            oldChannelMessages["Region"] = snapshotChat.data().messages;
          }
          this.setState({ channelMessages: oldChannelMessages });
          document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollTop = document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollHeight;
        }
      });
  }

  setChannelScrollBottom = () => {
    let scrollMessages = document.getElementsByClassName("CurrentChannel-ChatList")[0];
  };

  setMessagesInitial = (channelId) => {
    this.props.database
      .collection("chatChannels")
      .doc(channelId)
      .onSnapshot((snapshotChat) => {
        if (snapshotChat.exists) {
          let oldChannelMessages = this.state.channelMessages;
          if (document.getElementsByClassName("CurrentChannel-ChatList")[0] !== undefined) {
            oldChannelMessages[channelId] = snapshotChat.data().messages;
          }
          this.setState({ channelMessages: oldChannelMessages });
        }
      });
  };

  setCurrentChannel = (newChannelId) => {
    let userId;
    if (newChannelId.includes(" - ")) {
      userId = newChannelId.split(" - ");
      if (userId[0] === this.props.user.uid) userId = userId[1];
      else if (userId[1] === this.props.user.uid) userId = userId[0];

      this.props.database
        .collection("users")
        .doc(userId)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            if (this.state.channelMessages.hasOwnProperty(newChannelId)) {
              this.setState({ currentChannelId: newChannelId, currentChannelName: snapshot.data().username });
            } else {
              this.props.database
                .collection("chatChannels")
                .doc(newChannelId)
                .get()
                .then((snapshotChat) => {
                  if (snapshotChat.exists) {
                    this.setState({ currentChannelId: newChannelId, currentChannelName: snapshot.data().username });
                    this.setMessagesInitial(newChannelId);
                    document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollTop = document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollHeight;
                  }
                });
            }
          }
        });
    } else {
      if (this.state.channelMessages.hasOwnProperty(newChannelId)) {
        this.setState({ currentChannelId: newChannelId, currentChannelName: newChannelId });
      } else {
        this.props.database
          .collection("chatChannels")
          .doc(newChannelId)
          .get()
          .then((snapshotChat) => {
            if (snapshotChat.exists) {
              this.setState({ currentChannelId: newChannelId, currentChannelName: newChannelId });
              this.setMessagesInitial(newChannelId);
              document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollTop = document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollHeight;
            }
          });
      }
    }
  };

  sendMessage = (event) => {
    event.preventDefault();
    let inputBox = document.getElementById("InputBox");
    if (inputBox.value.length <= 2000) {
      this.props.database
        .collection("chatChannels")
        .doc(this.state.currentChannelId)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            let oldMessages = snapshot.data().messages;
            oldMessages.push({ channel: this.state.currentChannelId, messageContent: inputBox.value, sender: this.props.user.uid });
            this.props.database
              .collection("chatChannels")
              .doc(this.state.currentChannelId)
              .update({
                messages: oldMessages,
              })
              .then(() => {
                console.log(`Successfully sent message.`);
                inputBox.value = "";
                document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollTop = document.getElementsByClassName("CurrentChannel-ChatList")[0].scrollHeight;
              });
          }
        });
    }
  };

  render() {
    return (
      <div className="CurrentChannel-Content">
        <div className="CurrentChannel-Chat">
          <Paper className="CurrentChannel-ChatPaper" variant="outlined">
            <ListSubheader component="div">Channel History: ({this.state.currentChannelName})</ListSubheader>
            <Divider />
            <div className="CurrentChannel-ChatWindow">
              <List className="CurrentChannel-ChatList">
                {this.state.channelMessages[this.state.currentChannelId] !== undefined &&
                  this.state.channelMessages[this.state.currentChannelId].map((message, id) => {
                    return <Message id={id} key={id} messages={this.state.channelMessages[this.state.currentChannelId]} thisMessage={message} {...this.props} />;
                  })}
              </List>
              <Paper className="CurrentChannel-ChatInput" variant="outlined">
                <IconButton className="CurrentChannel-AddButton" color="secondary">
                  <AddIcon />
                </IconButton>
                <form noValidate autoComplete="off" className="CurrentChannel-ChatTextFieldContainer" onSubmit={this.sendMessage}>
                  <TextField id="InputBox" size="small" placeholder="Message" className="CurrentChannel-ChatTextField" color="secondary" fullWidth />
                </form>
                <IconButton className="CurrentChannel-SendButton" color="secondary" onClick={this.sendMessage}>
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
              <Channels setCurrentChannel={this.setCurrentChannel} currentChannelId={this.state.currentChannelId} {...this.props} />
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}
export default CurrentChannelTabPog;
