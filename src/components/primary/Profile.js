import React from "react";

import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
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
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ListSubheader from "@material-ui/core/ListSubheader";
import TextField from "@material-ui/core/TextField";

import { Link } from "react-router-dom";
import "./Profile.scss";

function ProfileLoggedIn(props) {
  let passedProps = {
    user: props.user,
    db: props.database,
  };

  const [avatarHovered, setAvatarHovered] = React.useState(false);
  const [pfpBlob, setPfpBlob] = React.useState("");
  const [username, setUsername] = React.useState("");

  const selectProfilePicture = (event) => {
    document.getElementById("pfpSelector").click();
  };

  const pfpChanged = (event) => {
    passedProps.db
      .collection("users")
      .doc(passedProps.user.uid)
      .get()
      .then((docSnapshot) => {
        if (docSnapshot.exists) {
          let file = event.target.files[0];
          let reader = new FileReader();
          reader.readAsDataURL(file);

          reader.onload = (readerEvent) => {
            let content = readerEvent.target.result;
            passedProps.db
              .collection("users")
              .doc(passedProps.user.uid)
              .update({
                pfp: content,
              })
              .then(() => {
                console.log(`Successfully updated profile picture.`);
              })
              .catch((error) => {
                console.error("Error updating profile picture", error);
              });
          };
        } else {
        }
      });
  };

  const submitNewName = (event) => {
    event.preventDefault();
    passedProps.db
      .collection("users")
      .doc(passedProps.user.uid)
      .update({
        username: document.getElementById("usernameInput").value,
      })
      .then(() => {
        console.log(`Successfully updated username.`);
      })
      .catch((error) => {
        console.error("Error updating username", error);
      });
  };

  React.useEffect(() => {
    passedProps.db
      .collection("users")
      .doc(passedProps.user.uid)
      .onSnapshot((snapshot) => {
        setPfpBlob(snapshot.data().pfp);
      });
    passedProps.db
      .collection("users")
      .doc(passedProps.user.uid)
      .get()
      .then((snapshot) => {
        if (
          snapshot.exists &&
          snapshot.data().username === passedProps.user.uid
        ) {
          setUsername("");
        } else if (
          snapshot.exists &&
          snapshot.data().username !== passedProps.user.uid
        ) {
          setUsername(snapshot.data().username);
        } else {
          setUsername();
        }
      });
  }, []);

  return (
    <div className="ProfileInner">
      <div className="Top">
        <Paper className="PaperTopLeft">
          <ListSubheader component="div" className="ListSubheader">
            Public Account
            <Divider component="li" />
          </ListSubheader>
          <div className="PaperContent">
            <IconButton
              className="AvatarButton"
              onMouseEnter={() => setAvatarHovered(true)}
              onMouseLeave={() => setAvatarHovered(false)}
              onClick={selectProfilePicture}
            >
              <Badge
                badgeContent={<AddPhotoAlternateIcon className="EditIcon" />}
                color="secondary"
              >
                <div className="Icons">
                  <Avatar
                    style={{
                      width: "60px",
                      height: "60px",
                    }}
                    src={pfpBlob}
                  >
                    <PersonIcon
                      className={clsx("PersonIcon", {
                        PersonIconHovered: avatarHovered,
                      })}
                    />
                    <Typography
                      className={clsx("TextOverlay", {
                        TextOverlayVisible: avatarHovered,
                      })}
                    >
                      Change
                    </Typography>
                  </Avatar>
                </div>
              </Badge>
              <input
                id="pfpSelector"
                type="file"
                name="Profile Picture"
                style={{ display: "none" }}
                onChange={pfpChanged}
                accept=".jpg, .jpeg, .png"
              />
            </IconButton>
            <form
              noValidate
              autoComplete="off"
              className="UsernameInput"
              onSubmit={submitNewName}
            >
              <TextField
                id="usernameInput"
                label="Username"
                className="Input"
                color="secondary"
                value={username}
                onInput={(event) => {
                  setUsername(event.target.value);
                }}
              />
            </form>
          </div>
        </Paper>
        <Paper className="PaperTopRight">
          <ListSubheader component="div" className="ListSubheader">
            Private Information
            <Divider component="li" />
          </ListSubheader>
        </Paper>
      </div>
      <Paper className="PaperBottom">
        <ListSubheader component="div" className="ListSubheader">
          Profile Settings
          <Divider component="li" />
        </ListSubheader>
      </Paper>
    </div>
  );
}

function ProfileNotLoggedIn(props) {
  return <div>You are NOT logged in!</div>;
}

function Profile(props) {
  return (
    <div className="Profile">
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
          <ListItem button key={"Messaging"} component={Link} to="/messaging">
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
        {props.loggedIn ? (
          <ProfileLoggedIn {...props} />
        ) : (
          <ProfileNotLoggedIn {...props} />
        )}
      </div>
    </div>
  );
}

export default Profile;
