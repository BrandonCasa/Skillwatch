import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { SketchPicker } from "react-color";

// Material UI
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import GroupIcon from "@material-ui/icons/Group";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import ListSubheader from "@material-ui/core/ListSubheader";
import Switch from "@material-ui/core/Switch";
import Grid from "@material-ui/core/Grid";

// SCSS
import "./SettingsPage.scss";

function SettingsPageNotLoggedIn(props) {
  return <div>You are NOT logged in!</div>;
}

function SettingsPageLoggedIn(props) {
  const [color, setColor] = React.useState(props.colors.primary.main);
  const [setupCompletePrimary, setSetupCompletePrimary] = React.useState(0);
  const [mode, setMode] = React.useState("primary");

  const setColors = (event) => {
    setColor(event);
    let colors = { [mode]: { main: color } };
    props.setColors(colors, props.user, props.database);
  };

  const saveColors = (event) => {
    props.saveColors(props.user, props.database);
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setMode("secondary");
      setColor(props.colors.secondary.main);
    } else {
      setMode("primary");
      setColor(props.colors.primary.main);
    }
  };

  React.useEffect(() => {
    if (setupCompletePrimary < 2) {
      setColor(props.colors.primary.main);
      setSetupCompletePrimary(setupCompletePrimary + 1);
    }
  }, [props.colors.primary.main]);

  return (
    <div className="SettingsPageInner">
      <Paper className="PaperAppSettings">
        <ListSubheader component="div" className="ListSubheader">
          App Settings
          <Divider component="li" />
        </ListSubheader>
      </Paper>
      <Paper className="PaperColorPicker">
        <ListSubheader component="div" className="ListSubheader">
          Theme Designer
          <Divider component="li" />
        </ListSubheader>
        <div className="ColorContent">
          <Typography component="div" className="Switch">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Primary</Grid>
              <Grid item>
                <Switch checked={mode === "secondary"} onChange={handleChange} name="checkedC" />
              </Grid>
              <Grid item>Secondary</Grid>
            </Grid>
          </Typography>
        </div>
        <div className="ColorContent">
          <SketchPicker className="Picker" color={color} onChange={setColors} onChangeComplete={saveColors} />
        </div>
      </Paper>
    </div>
  );
}

function SettingsPage(props) {
  return (
    <div className="SettingsPage">
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
        {props.loggedIn ? <SettingsPageLoggedIn {...props} /> : <SettingsPageNotLoggedIn {...props} />}
      </div>
    </div>
  );
}

export default SettingsPage;
