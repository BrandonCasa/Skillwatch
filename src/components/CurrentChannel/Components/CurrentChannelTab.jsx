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
import { Scrollbars } from "react-custom-scrollbars";

// SCSS
import "./CurrentChannelTab.scss";
// Custom Components
import FriendChannel from "./FriendChannel";
import PublicChannel from "./PublicChannel";
import CustomScrollbar from "./CustomScrollbar";

function Channels(props) {
  const onClickFriend = (event, friendId) => {
    let docRefA = props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`);
    let docRefB = props.database.collection("chatChannels").doc(`${friendId} - ${props.user.uid}`);

    docRefA.get().then((docA) => {
      if (docA.exists) {
        // If `${props.user.uid} - ${friendId}` DOES exist
        props.setCurrentChannelId(`${props.user.uid} - ${friendId}`, props.user, props.database);
      } else {
        // If `${props.user.uid} - ${friendId}` DOES NOT exist
        docRefB.get().then((docB) => {
          if (docB.exists) {
            // If `${friendId} - ${props.user.uid}` DOES exist
            props.setCurrentChannelId(`${friendId} - ${props.user.uid}`, props.user, props.database);
          } else {
            // If `${friendId} - ${props.user.uid}` DOES NOT exist
            props.database.collection("chatChannels").doc(`${props.user.uid} - ${friendId}`).set({ messages: [] });
            props.setCurrentChannelId(`${props.user.uid} - ${friendId}`, props.user, props.database);
          }
        });
      }
    });
  };
  const onClickPublicChannel = (event, channelName) => {
    props.setCurrentChannelId(channelName, props.user, props.database);
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
          selected={props.currentChannelId === friendId}
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
  chatScrollbar = React.createRef();
  constructor(props) {
    super(props);

    this.state = {};
  }
  componentDidUpdate() {}

  componentDidMount() {}

  setMessagesInitial = (channelId) => {};

  setCurrentChannel = (newChannelId) => {};

  sendMessage = (event) => {
    event.preventDefault();
  };

  handleScroll = () => {};

  render() {
    return (
      <div className="CurrentChannel-Content">
        <div className="CurrentChannel-Chat">
          <Paper className="CurrentChannel-ChatPaper" variant="outlined">
            <ListSubheader component="div">Channel History: ({this.props.currentChannelName})</ListSubheader>
            <Divider />
            <div className="CurrentChannel-ChatWindow">
              <Scrollbars className="CurrentChannel-ChatScroll" onScroll={this.handleScroll} ref={this.chatScrollbar} id="scrollable">
                <List className="CurrentChannel-ChatList"></List>
              </Scrollbars>
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
              <Channels currentChannelId={this.props.currentChannelId} {...this.props} />
            </List>
          </Paper>
        </div>
      </div>
    );
  }
}
export default CurrentChannelTabPog;
