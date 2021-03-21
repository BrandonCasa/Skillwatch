import React from "react";

import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
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
import Divider from "@material-ui/core/Divider";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import "./App.scss";

import HomeContainer from "../../containers/HomeContainer";
import ProfileContainer from "../../containers/ProfileContainer";
import MessagingContainer from "../../containers/MessagingContainer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function LoginRegisterBtn(props) {
  const [open, setOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [pass, setPass] = React.useState("");
  const [errorText, setErrorText] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onEmailInput = (event) => {
    setEmail(event.target.value);
  };

  const onPassInput = (event) => {
    setPass(event.target.value);
  };

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(() => {
        setOpen(false);
      })
      .catch((error) => {
        const errorMessage = error.message;
        setErrorText(errorMessage);
      });
  };

  const loginemail = (event) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, pass)
      .then(() => {
        firebase
          .auth()
          .signInWithEmailAndPassword(email, pass)
          .then((userCredential) => {
            // var user = userCredential.user;
            setOpen(false);
          })
          .catch((error) => {
            // var errorCode = error.code;
            const errorMessage = error.message;
            setErrorText(errorMessage);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, pass)
            .then((userCredential) => {
              // var user = userCredential.user;
              setOpen(false);
            })
            .catch((error) => {
              // var errorCode = error.code;
              const errorMessage = error.message;
              setErrorText(errorMessage);
            });
        }
      });
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
          {errorText === "" ? null : <h1>{errorText}</h1>}
          <TextField
            color="secondary"
            autoFocus
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            onInput={onEmailInput}
            value={email}
          />
          <TextField
            color="secondary"
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            onInput={onPassInput}
            value={pass}
          />
          <Typography variant="subtitle2" color="primary">
            (other login methods will be added in a future update)
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={loginemail} color="secondary">
            Login
          </Button>
        </DialogActions>
        <Divider />
        <DialogActions>
          <Button
            onClick={signInWithGoogle}
            color="secondary"
            variant="contained"
          >
            Login With Google
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ProfMenu(props) {
  const history = useHistory();

  const [profBtnAnchorEl, setProfBtnAnchorEl] = React.useState(null);
  const [toProfileAllowed, setToProfileAllowed] = React.useState(
    !(history.location.pathname === "/account/profile")
  );
  const profBtnOpen = Boolean(profBtnAnchorEl);

  const handleMenu = (event) => {
    setProfBtnAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfBtnAnchorEl(null);
  };

  const toProfile = () => {
    setProfBtnAnchorEl(null);
    history.push("/account/profile");
  };

  const logOut = () => {
    setProfBtnAnchorEl(null);
    firebase.auth().signOut();
  };

  history.listen((location, action) => {
    if (action === "PUSH" && location.pathname === "/account/profile") {
      setToProfileAllowed(false);
    } else if (
      action === "PUSH" &&
      !(location.pathname === "/account/profile")
    ) {
      setToProfileAllowed(true);
    }
  });

  return (
    <div>
      <IconButton onClick={handleMenu} color="inherit">
        <SettingsIcon />
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
        <MenuItem onClick={toProfile} disabled={!toProfileAllowed}>
          Profile
        </MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

function App(props) {
  const [loggedIn, setLoggedIn] = React.useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    setLoggedIn(!!user);
  });

  return (
    <Router>
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
              <div
                className={clsx("LoginVisible", {
                  LoginInvisible: loggedIn,
                })}
              >
                <LoginRegisterBtn {...props} />
              </div>
              <div
                className={clsx("LoginVisible", {
                  LoginInvisible: !loggedIn,
                })}
              >
                <ProfMenu {...props} />
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/messaging">
              <MessagingContainer />
            </Route>
            <Route path="/account/profile">
              <ProfileContainer />
            </Route>
            <Route path="/">
              <HomeContainer />
            </Route>
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
