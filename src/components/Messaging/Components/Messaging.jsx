import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
// SCSS
import "./Messaging.scss";
// Custom Components
import LoggedIn from "./LoggedIn";

function Messaging(props) {
  return (
    <div className="Messaging">
      <Drawer
        className="Messaging-Drawer"
        variant="persistent"
        anchor="left"
        open={props.primaryDrawerOpen}
        classes={{
          paper: "Messaging-DrawerPaper",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={"Messaging-MenuButton"}
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
        <Divider />
        <List>
          <ListItem
            button
            key={"Profile"}
            component={Link}
            to="/account/profile"
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary={"Profile"} />
          </ListItem>
        </List>
      </Drawer>
      <div
        className={clsx("Messaging-Content", {
          "Messaging-ContentClosed": !props.primaryDrawerOpen,
        })}
      >
        {props.loggedIn ? (
          <LoggedIn {...props} />
        ) : (
          "Please Login to use messaging"
        )}
      </div>
    </div>
  );
}

export default Messaging;
