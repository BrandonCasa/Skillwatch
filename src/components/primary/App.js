import React from "react";

import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";

import firebase from "firebase/app";
import "firebase/auth";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";

import HomeContainer from "../../containers/HomeContainer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function LoginRegisterBtn(props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Login/Register
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Login</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you don't own an account, begin typing an email to create one.
          </DialogContentText>
          <TextField
            color="secondary"
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ProfMenu(props) {
  const [profBtnAnchorEl, setProfBtnAnchorEl] = React.useState(null);
  const profBtnOpen = Boolean(profBtnAnchorEl);

  const handleMenu = (event) => {
    setProfBtnAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfBtnAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleMenu} color="inherit">
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={profBtnAnchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={profBtnOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
      </Menu>
    </div>
  );
}

function App(props) {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="static"
          className={clsx("AppBar", {
            AppBarShift: props.primaryDrawerOpen,
          })}
        >
          <Toolbar
            className={clsx("Toolbar", {
              ToolbarShift: props.primaryDrawerOpen,
            })}
          >
            <IconButton
              edge="start"
              className={clsx("MenuButtonVisible", {
                MenuButtonInvisible: props.primaryDrawerOpen,
              })}
              color="inherit"
              onClick={() => {
                props.setPrimaryDrawerOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              className={clsx("TitleVisible", {
                TitleInvisible: props.primaryDrawerOpen,
              })}
            >
              Skillwatch
            </Typography>
            {firebase.auth().currentUser === null ? (
              <LoginRegisterBtn {...props} />
            ) : (
              <ProfMenu {...props} />
            )}
          </Toolbar>
        </AppBar>
        <Router>
          <Switch>
            <Route path="/">
              <HomeContainer />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
