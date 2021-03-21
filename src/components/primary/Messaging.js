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
        <Paper className="ChatWindow">
          <List
            subheader={
              <ListSubheader component="div">Selected Message</ListSubheader>
            }
          >
            <Divider component="li" />
            <ListItem button>
              <ListItemIcon>
                <Avatar>P</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Phantompigz
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <div>
                    <React.Fragment>
                      {
                        " — Yeah I'll be on tomorrow as you saw from my inbox message."
                      }
                    </React.Fragment>
                    <br />
                    <React.Fragment>
                      {" — Oh by the way, when does the new patch come out?"}
                    </React.Fragment>
                  </div>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem button>
              <ListItemIcon>
                <Avatar>K</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Kanna
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <div>
                    <React.Fragment>
                      {
                        " — Great, I'm available most of tomorrow too. I'm not sure when the new patch comes out though."
                      }
                    </React.Fragment>
                    <br />
                    <React.Fragment>
                      {
                        " — Hopefully they fixed Doomfist, been waiting on bug fixes for some time now..."
                      }
                    </React.Fragment>
                    <br />
                    <React.Fragment>
                      {
                        " — The experimental card is looking promising. What do you think about it?"
                      }
                    </React.Fragment>
                  </div>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem button>
              <ListItemIcon>
                <Avatar>P</Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Phantompigz
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <div>
                    <React.Fragment>
                      {
                        " — Honestly I'm hoping they push it to live with the patch, it has some nice balance adjustments in it."
                      }
                    </React.Fragment>
                  </div>
                }
              />
            </ListItem>
          </List>
        </Paper>
        <Paper className="FriendsWindow">
          <List
            subheader={
              <ListSubheader component="div">Inbox Messages</ListSubheader>
            }
          >
            <Divider component="li" />
            <ListItem button>
              <ListItemIcon>
                <Badge badgeContent={1} color="secondary">
                  <Avatar>P</Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="I'll be off work."
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Phantompigz
                    </Typography>
                    {" — Some things cleared up and I'll be on tomorrow…"}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider variant="inset" component="li" />
            <ListItem button>
              <ListItemIcon>
                <Badge color="secondary">
                  <Avatar>K</Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="I made it to diamond!"
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="textPrimary"
                    >
                      Kanna
                    </Typography>
                    {
                      " — I made it to diamond yesterday, if you want to duo later…"
                    }
                  </React.Fragment>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default Messaging;
