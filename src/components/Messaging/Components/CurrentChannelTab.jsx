import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
// SCSS
import "./CurrentChannelTab.scss";

function CurrentChannelTab(props) {
  return (
    <div className="CurrentChannel-Content">
      <div className="CurrentChannel-Chat">
        <Paper className="CurrentChannel-ChatPaper" variant="outlined">
          <ListSubheader component="div">
            {`Channel History: (${props.currentChannel})`}
          </ListSubheader>
          <Divider />
          <List className="CurrentChannel-ChatList">
            {"<MessagesGenerator {...props} />"}
          </List>
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
        </Paper>
      </div>
    </div>
  );
}

export default CurrentChannelTab;
