import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import PersonIcon from "@material-ui/icons/Person";
import ChatIcon from '@material-ui/icons/Chat';
// SCSS
import "./PublicChannel.scss";

function PublicChannel(props) {
  return (
    <ListItem
      button
      className="PublicChannel-Content"
      selected={props.selected}
      onClick={(event) => {
        props.clicky(event, props.channelName);
      }}
    >
      <ListItemIcon>
        <Avatar>
          <ChatIcon className="ChatIcon" />
        </Avatar>
      </ListItemIcon>
      <ListItemText primary={props.channelName} />
    </ListItem>
  );
}

export default PublicChannel;
