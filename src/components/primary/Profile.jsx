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
import SaveIcon from "@material-ui/icons/Save";
import InputAdornment from "@material-ui/core/InputAdornment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { Link } from "react-router-dom";
import "./Profile.scss";

function ProfileLoggedIn(props) {
  let passedProps = {
    user: props.user,
    db: props.database,
  };

  const [avatarHovered, setAvatarHovered] = React.useState(false);

  const selectProfilePicture = (event) => {
    document.getElementById("pfpSelector").click();
  };
  const pfpChanged = (event) => {
    let file = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (readerEvent) => {
      let content = readerEvent.target.result;
      props.setProfilePicture(content, props.user, props.database);
    };
  };

  const submitNewInfo = (event) => {
    event.preventDefault();

    if (document.getElementById("usernameInput").value.replaceAll(" ", "") !== "") {
      props.setUsername(document.getElementById("usernameInput").value, props.user, props.database);
    }
    if (document.getElementById("bioInput").value.replaceAll(" ", "") !== "") {
      props.setBio(document.getElementById("bioInput").value, props.user, props.database);
    }
    props.setSnackbarOpen(false);
    props.setSnackbarOpen(true);
    props.setSnackbarText("Updated user information.");
  };

  React.useEffect(() => {
    if (props.username !== "") {
      document.getElementById("usernameInput").value = props.username;
    }
  }, [props.username]);

  React.useEffect(() => {
    if (props.bio !== "") {
      document.getElementById("bioInput").value = props.bio;
    }
  }, [props.bio]);

  console.log(props.bio);

  return (
    <div className="ProfileInner">
      <div className="Top">
        <Paper className="PaperTopLeft">
          <ListSubheader component="div" className="ListSubheader">
            Public Account
            <Divider component="li" />
          </ListSubheader>
          <div className="PaperContent">
            <IconButton className="AvatarButton" onMouseEnter={() => setAvatarHovered(true)} onMouseLeave={() => setAvatarHovered(false)} onClick={selectProfilePicture}>
              <Badge badgeContent={<AddPhotoAlternateIcon className="EditIcon" />} color="secondary">
                <div className="Icons">
                  <Typography
                    className={clsx("TextOverlay", {
                      TextOverlayVisible: avatarHovered,
                    })}
                  >
                    Change
                  </Typography>
                  <Avatar
                    style={{
                      width: "60px",
                      height: "60px",
                    }}
                    src={props.profilePicture}
                  >
                    <PersonIcon
                      className={clsx("PersonIcon", {
                        PersonIconHovered: avatarHovered,
                      })}
                    />
                  </Avatar>
                </div>
              </Badge>
              <input id="pfpSelector" type="file" name="Profile Picture" style={{ display: "none" }} onChange={pfpChanged} accept=".jpg, .jpeg, .png" />
            </IconButton>
            <form noValidate autoComplete="off" className="UsernameInput" onSubmit={submitNewInfo}>
              <TextField id="usernameInput" label="Username" className="Input" color="secondary" defaultValue=" " />
            </form>
            <form noValidate autoComplete="off" className="UsernameInput" onSubmit={submitNewInfo}>
              <TextField id="bioInput" label="Bio" className="Input" color="secondary" defaultValue=" " />
            </form>
            <IconButton className="SaveButton" onClick={submitNewInfo}>
              <SaveIcon />
            </IconButton>
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
            Skillchat
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
          <ListItem button key={"Messaging"} component={Link} to="/messaging">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Messaging"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button disabled={true} key={"Profile"} component={Link} to="/account/profile">
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItem>
        </List>
      </Drawer>
      <div
        className={clsx("Content", {
          ContentClosed: !props.primaryDrawerOpen,
        })}
      >
        {props.loggedIn ? <ProfileLoggedIn {...props} /> : <ProfileNotLoggedIn {...props} />}
      </div>
    </div>
  );
}

export default Profile;
