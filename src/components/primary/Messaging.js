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
import Grid from "@material-ui/core/Grid";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import EmojiEmotionsIcon from "@material-ui/icons/EmojiEmotions";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import TextField from "@material-ui/core/TextField";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";

import { Link } from "react-router-dom";
import "./Messaging.scss";

function Messaging(props) {
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
        <Grid container className="Grid">
          <Grid item xs={9}>
            <Paper className="ChannelHistory">
              <Typography
                style={{
                  textAlign: "center",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                }}
              >
                Channel History
              </Typography>
              <div className="ChatHistory"></div>
              <div className="ChatInputContainer">
                <Paper className="ChatInput" elevation={3}>
                  <TextField
                    className="ChatInputField"
                    label="Message"
                    type="text"
                    fullWidth
                  />
                </Paper>
                <ButtonGroup
                  variant="contained"
                  color="primary"
                  className="ChatInputControls"
                >
                  <Button className="Buttons">
                    <CloudUploadIcon />
                  </Button>
                  <Button className="Buttons">
                    <EmojiEmotionsIcon />
                  </Button>
                  <Button className="SendBtn" color="secondary">
                    Send
                  </Button>
                </ButtonGroup>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={3}>
            <Paper className="MessageHistory">
              <List>
                <ListItem key={0}>
                  <ListItemText
                    primary={"Channels"}
                    style={{ textAlign: "center" }}
                  />
                </ListItem>
                <ListItem button key={1}>
                  <ListItemIcon>
                    <Badge badgeContent={4} color="secondary">
                      <Avatar
                        alt="Brandon Casamichana"
                        src="/static/images/avatar/1.jpg"
                      />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText primary={"Brandon C."} />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Messaging;
