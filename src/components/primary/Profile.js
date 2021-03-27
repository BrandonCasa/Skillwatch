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
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import AddPhotoAlternateIcon from "@material-ui/icons/AddPhotoAlternate";
import ListSubheader from "@material-ui/core/ListSubheader";

import { Link } from "react-router-dom";
import "./Profile.scss";

function ProfileLoggedIn(props) {
  const [avatarHovered, setAvatarHovered] = React.useState(false);

  return (
    <div className="ProfileInner">
      <div className="Top">
        <Paper className="PaperTopLeft">
          <ListSubheader component="div" className="ListSubheader">
            Public Account
            <Divider component="li" />
          </ListSubheader>
          <IconButton
            className="AvatarButton"
            onMouseEnter={() => setAvatarHovered(true)}
            onMouseLeave={() => setAvatarHovered(false)}
          >
            <Badge
              badgeContent={<AddPhotoAlternateIcon className="EditIcon" />}
              color="secondary"
            >
              <Avatar
                style={{
                  width: "60px",
                  height: "60px",
                }}
              >
                <div className="Icons">
                  <Typography
                    className={clsx("TextOverlay", {
                      TextOverlayVisible: avatarHovered,
                    })}
                  >
                    Change
                  </Typography>
                  <PersonIcon
                    className={clsx("PersonIcon", {
                      PersonIconHovered: avatarHovered,
                    })}
                  />
                </div>
              </Avatar>
            </Badge>
          </IconButton>
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
