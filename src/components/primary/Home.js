import React from "react";

import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIcon from "@material-ui/icons/Group";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { Link } from "react-router-dom";
import "./Home.scss";

function HomeLoggedIn(props) {
  return (
    <div>
      You are logged in!
      <br />
      Please either go to Messaging or check out the in development Profile page; accessable at the top right.
    </div>
  );
}

function HomeNotLoggedIn(props) {
  return <div>You are NOT logged in!</div>;
}

function Home(props) {
  return (
    <div className="Home">
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
          <ListItem button key={"Home"} disabled={true} component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button key={"Social"} component={Link} to="/social">
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Social"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button key={"Profile"} component={Link} to="/account/profile">
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
        {props.loggedIn ? <HomeLoggedIn {...props} /> : <HomeNotLoggedIn {...props} />}
      </div>
    </div>
  );
}

export default Home;
