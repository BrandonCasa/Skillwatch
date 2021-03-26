import React from "react";

import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIcon from "@material-ui/icons/Group";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import ListSubheader from "@material-ui/core/ListSubheader";
import AddIcon from "@material-ui/icons/Add";
import SendIcon from "@material-ui/icons/Send";
import ChatIcon from "@material-ui/icons/Chat";
import PersonIcon from "@material-ui/icons/Person";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import "firebase/firestore";

import { Link } from "react-router-dom";
import "./Messaging.scss";

function Username(props) {
  const [name, setName] = React.useState("Please Select a Channel");

  if (props.userid !== "") {
    props.database
      .collection("users")
      .doc(props.userid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          setName(docSnapshot.data().username);
        } else {
          setName(props.userid);
        }
      });
  }

  return name;
}

function MessagesGenerator(props) {
  if (props.messageData !== "") {
    return (
      <React.Fragment>
        {props.messageData.messages.map((message, id) => (
          <ListItem button key={id}>
            <ListItemIcon>
              <Badge color="secondary">
                <Avatar>
                  <PersonIcon />
                </Avatar>
              </Badge>
            </ListItemIcon>
            <ListItemText
              primary={
                <Username
                  database={props.database}
                  userid={message.sender}
                  {...props}
                />
              }
              secondary={message.content}
            />
          </ListItem>
        ))}
      </React.Fragment>
    );
  } else {
    return "";
  }
}

function MessagingNew(props) {
  const [loggedIn, setLoggedIn] = React.useState(!!firebase.auth().currentUser);

  firebase.auth().onAuthStateChanged((user) => {
    setLoggedIn(!!user);
  });

  if (loggedIn) {
    return <MessagingLoggedin {...props} />;
  } else {
    return (
      <div className="Messaging">
        <Drawer
          className="Drawer"
          variant="persistent"
          anchor="left"
          open={props.primaryDrawerOpen}
          classes={{
            paper: "DrawerPaper",
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              className={"MenuButton"}
              color="inherit"
              onClick={() => {
                props.setPrimaryDrawerOpen(false);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" className="Title">
              Skillwatch
            </Typography>
          </Toolbar>
          <Divider />
          <List>
            <ListItem button key={"Home"} component={Link} to="/">
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={"Home"} />
            </ListItem>
            <ListItem button key={"Tracking"}>
              <ListItemIcon>
                <TrendingUpIcon />
              </ListItemIcon>
              <ListItemText primary={"Tracking"} />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem
              button
              key={"Messaging"}
              disabled={true}
              component={Link}
              to="/messaging"
            >
              <ListItemIcon>
                <GroupIcon />
              </ListItemIcon>
              <ListItemText primary={"Messaging"} />
            </ListItem>
          </List>
        </Drawer>
        <div
          className={clsx("Content", {
            ContentClosed: !props.primaryDrawerOpen,
          })}
        >
          Please Login to use messaging.
        </div>
      </div>
    );
  }
}

function MessagingLoggedin(props) {
  // Props
  let passedProps = {
    checkUserExists: props.checkUserExists,
    user: props.user,
  };

  // Custom variables
  let db = firebase.firestore();

  // State
  const [currentChannel, setCurrentChannel] = React.useState("");
  const [inputPlaceholder, setInputPlaceholder] = React.useState("");
  const [messageData, setMessageData] = React.useState("");

  // Functions
  const changeCurrentChannel = (newChannel) => {
    let scrollChannel = currentChannel;
    let topOld = 0;

    db.collection("chatChannels")
      .doc(newChannel)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          setInputPlaceholder(`Message: (${newChannel})`);
          setCurrentChannel(newChannel);
        } else {
          setInputPlaceholder(`Message: (Unknown Channel)`);
          setCurrentChannel(newChannel);
        }
      });
    db.collection("chatChannels")
      .doc(newChannel)
      .onSnapshot((snapshot) => {
        let scrollMessages = document.getElementsByClassName("Messages");

        setMessageData(snapshot.data());

        if (scrollMessages !== undefined && scrollChannel !== newChannel) {
          scrollMessages[0].scrollTop = scrollMessages[0].scrollHeight;
          topOld = scrollMessages[0].scrollTop;
          scrollChannel = newChannel;
        }
        if (
          scrollMessages !== undefined &&
          scrollChannel === newChannel &&
          topOld === scrollMessages[0].scrollTop
        ) {
          scrollMessages[0].scrollTop = scrollMessages[0].scrollHeight;
          topOld = scrollMessages[0].scrollTop;
        }
        if (
          scrollMessages !== undefined &&
          scrollMessages[0].scrollHeight - scrollMessages[0].scrollTop < 850
        ) {
          scrollMessages[0].scrollTop = scrollMessages[0].scrollHeight;
          topOld = scrollMessages[0].scrollTop;
        }
      });
  };

  const sendMessage = () => {
    let inputBox = document.getElementsByClassName("InputBox");
    if (inputBox[0] !== undefined) {
      const newMessage = {
        sender: passedProps.user.uid,
        content: inputBox[0].value,
      };
      if (currentChannel !== "") {
        db.collection("chatChannels")
          .doc(currentChannel)
          .get()
          .then((docSnapshot) => {
            if (docSnapshot.exists) {
              let oldMessages = docSnapshot.data().messages;
              oldMessages.push(newMessage);
              db.collection("chatChannels")
                .doc(currentChannel)
                .update({
                  messages: oldMessages,
                })
                .then(() => {
                  console.log(`Successfully sent message.`);
                  inputBox[0].value = "";
                })
                .catch((error) => {
                  console.error("Error sending message", error);
                });
            }
          });
      }
    }
  };

  return (
    <div className="Messaging">
      <Drawer
        className="Drawer"
        variant="persistent"
        anchor="left"
        open={props.primaryDrawerOpen}
        classes={{
          paper: "DrawerPaper",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={"MenuButton"}
            color="inherit"
            onClick={() => {
              props.setPrimaryDrawerOpen(false);
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" className="Title">
            Skillwatch
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button key={"Home"} component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button key={"Tracking"}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary={"Tracking"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key={"Messaging"}
            disabled={true}
            component={Link}
            to="/messaging"
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Messaging"} />
          </ListItem>
        </List>
      </Drawer>
      <div
        className={clsx("Content", {
          ContentClosed: !props.primaryDrawerOpen,
        })}
      >
        <div className="Chat">
          <Paper className="ChatWindow">
            <List
              className="ChatList"
              subheader={
                <ListSubheader component="div">
                  Channel History: (
                  <Username database={db} userid={currentChannel} {...props} />)
                  <Divider component="li" />
                </ListSubheader>
              }
            >
              {currentChannel !== "" ? (
                <div className="Messages">
                  <MessagesGenerator
                    messageData={messageData}
                    database={db}
                    {...props}
                  />
                </div>
              ) : (
                <div>Please select a channel.</div>
              )}
            </List>
          </Paper>
          <Paper className="ChatInput">
            <IconButton className="IconButtonLeft">
              <AddIcon />
            </IconButton>
            <Divider orientation="vertical" />
            <form
              className="InputBoxForm"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                className="InputBox"
                placeholder={inputPlaceholder}
              />
            </form>
            <Divider orientation="vertical" />
            <IconButton className="IconButtonRight" onClick={sendMessage}>
              <SendIcon color="secondary" />
            </IconButton>
          </Paper>
        </div>
        <Paper className="FriendsWindow">
          <List
            subheader={<ListSubheader component="div">Channels</ListSubheader>}
          >
            <Divider component="li" key={0} />
            <ListItem
              button
              onClick={() => changeCurrentChannel("General")}
              key={1}
            >
              <ListItemIcon>
                <Badge color="secondary">
                  <Avatar>
                    <ChatIcon />
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText primary="General Chat" />
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default MessagingNew;
