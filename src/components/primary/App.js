import React from "react";
import randomUsernameGen from "random-username-generator";
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
import Paper from "@material-ui/core/Paper";
import MicIcon from "@material-ui/icons/Mic";
import Popover from "@material-ui/core/Popover";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import PersonIcon from "@material-ui/icons/Person";
import isElectron from "is-electron";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";
import MinimizeIcon from "@material-ui/icons/Minimize";
import MaximizeIcon from "@material-ui/icons/Maximize";

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/messaging";
import "firebase/firestore";

import { HashRouter as Router, Switch, Route, useHistory } from "react-router-dom";
import "./App.scss";

import HomeContainer from "../../containers/HomeContainer";
import ProfileContainer from "../../containers/ProfileContainer";
import MessagingContainer from "../../containers/MessagingContainer";
import SettingsPageContainer from "../../containers/SettingsPageContainer";

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
      .then((result) => {
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
            props.setLoggedIn(true);
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
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <DialogContentText>If you don't own an account, begin typing an email to create one.</DialogContentText>
          {errorText === "" ? null : <h1>{errorText}</h1>}
          <TextField color="secondary" autoFocus margin="dense" label="Email Address" type="email" fullWidth onInput={onEmailInput} value={email} />
          <TextField color="secondary" margin="dense" label="Password" type="password" fullWidth onInput={onPassInput} value={pass} />
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
          <Button onClick={signInWithGoogle} color="secondary" variant="contained">
            Login With Google
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function ProfMenu(props) {
  const history = useHistory();

  const [settingsBtnAnchorEl, setSettingsBtnAnchorEl] = React.useState(null);
  const [statusMenuAnchorEl, setStatusMenuAnchorEl] = React.useState(null);
  const statusMenuOpen = Boolean(statusMenuAnchorEl);
  const [toSettingsAllowed, setToSettingsAllowed] = React.useState(!(history.location.pathname === "/account/settings"));
  const settingsBtnOpen = Boolean(settingsBtnAnchorEl);

  let db = firebase.firestore();
  let user = firebase.auth().currentUser;

  const handleMenu = (event) => {
    setSettingsBtnAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setSettingsBtnAnchorEl(null);
  };
  const handleCloseStatusMenu = () => {
    setStatusMenuAnchorEl(null);
  };
  const toSettings = () => {
    setSettingsBtnAnchorEl(null);
    history.push("/account/settings");
  };
  const logOut = () => {
    setSettingsBtnAnchorEl(null);
    firebase.auth().signOut();
  };
  const setOnline = () => {
    props.setStatus("Online", user, db);
  };
  const setOffline = () => {
    props.setStatus("Offline", user, db);
  };
  const setAway = () => {
    props.setStatus("Away", user, db);
  };
  const setDnD = () => {
    props.setStatus("DnD", user, db);
  };

  const handleStatusMenu = (event) => {
    setStatusMenuAnchorEl(event.currentTarget);
  };

  React.useEffect(() => {
    firebase.auth().onAuthStateChanged((tempUser) => {
      if (tempUser) {
        user = tempUser;
      } else {
        user = undefined;
      }
    });
    history.listen((location, action) => {
      if (action === "PUSH" && location.pathname === "/account/settings") {
        setToSettingsAllowed(false);
      } else if (action === "PUSH" && location.pathname !== "/account/settings") {
        setToSettingsAllowed(true);
      }
    });
  }, []);

  return (
    <div>
      <div className="App-TopRight">
        <Paper className="App-UserSettings">
          <IconButton className="App-Avatar" color="inherit" onClick={handleStatusMenu}>
            <Badge
              className={`Badge Badge-${props.status}`}
              variant="dot"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <div>
                <Avatar src={props.profilePicture} className="App-AvatarIcon">
                  <PersonIcon className="PersonIcon" />
                </Avatar>
              </div>
            </Badge>
          </IconButton>
          <div className="SpacerA" />
          <IconButton className="App-SettingsButton" onClick={handleMenu} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Paper>
        {isElectron() && (
          <>
            <Paper className="App-Paper">
              <IconButton className="App-WindowButton" onClick={() => window.api.send("toMain", "minimize-app")} color="inherit">
                <MinimizeIcon />
              </IconButton>
            </Paper>
            <Paper className="App-Paper">
              <IconButton className="App-WindowButton" onClick={() => window.api.send("toMain", "maximize-app")} color="inherit">
                <MaximizeIcon />
              </IconButton>
            </Paper>
            <Paper className="App-Paper">
              <IconButton className="App-WindowButton" onClick={() => window.api.send("toMain", "close-app")} color="inherit">
                <CloseIcon />
              </IconButton>
            </Paper>
          </>
        )}
      </div>
      <Popover
        id="menu-appbar"
        open={statusMenuOpen}
        onClose={handleCloseStatusMenu}
        anchorEl={statusMenuAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={setOnline} disabled={props.status === "Online"}>
          Go Online
        </MenuItem>
        <MenuItem onClick={setOffline} disabled={props.status === "Offline"}>
          Go Offline
        </MenuItem>
        <MenuItem onClick={setAway} disabled={props.status === "Away"}>
          Go Away
        </MenuItem>
        <MenuItem onClick={setDnD} disabled={props.status === "DnD"}>
          Go Do Not Disturb
        </MenuItem>
      </Popover>
      <Popover
        id="menu-appbar"
        open={settingsBtnOpen}
        onClose={handleClose}
        anchorEl={settingsBtnAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <MenuItem onClick={toSettings} disabled={!toSettingsAllowed}>
          Settings
        </MenuItem>
        <MenuItem onClick={logOut}>Logout</MenuItem>
      </Popover>
    </div>
  );
}

function App(props) {
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [downloadComplete, setDownloadComplete] = React.useState(false);
  const [downloading, setDownloading] = React.useState(false);
  const [downloadProgress, setDownloadProgress] = React.useState(-100);
  const [downloadSpeed, setDownloadSpeed] = React.useState(-100);
  //const [downloadTotal, setDownloadTotal] = React.useState(-100);
  //const [downloadCurrent, setDownloadCurrent] = React.useState(-100);
  const [userSet, setUserSet] = React.useState(false);
  const [channels, setChannels] = React.useState([]);

  let user = firebase.auth().currentUser;
  let db = firebase.firestore();
  let defaultUser = {
    username: randomUsernameGen.generate(),
    friends: [],
    pfp: "",
    bio: "",
    selfTags: [],
    incomingFriendRequests: [],
    outgoingFriendRequests: [],
    status: "Online",
    colors: {
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  };

  // Functions
  const checkUserExists = (callback) => {
    if (user !== undefined) {
      db.collection("users")
        .doc(user.uid)
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            let keys = Object.keys(defaultUser);
            keys.forEach((key) => {
              if (!docSnapshot.data().hasOwnProperty(key)) {
                updateFieldToUser(key, defaultUser[key]);
              }
            });

            db.collection("users")
              .doc("FriendStore")
              .get()
              .then((friendStoreSnap) => {
                if (friendStoreSnap.exists) {
                  let myUsername = docSnapshot.data().username;
                  let usernames = friendStoreSnap.data().usernames;

                  if (!usernames.hasOwnProperty(myUsername)) {
                    usernames[myUsername] = user.uid;
                    updateUsernameJson(usernames);
                  }
                }
              });
          } else {
            createUser(callback);
          }
        });
    }
  };
  const updateFieldToUser = (fieldName, fieldValue, callback) => {
    db.collection("users")
      .doc(user.uid)
      .update({
        [fieldName]: fieldValue,
      })
      .then(function () {
        console.log(`Successfully updated the user's field called "${fieldName}" to be "${fieldValue}"`);
        if (callback !== undefined) callback(true);
      })
      .catch(function (error) {
        console.error("Error updating a user's field: ", error);
        if (callback !== undefined) callback(false);
      });
  };
  const createUser = (callback) => {
    if (user !== undefined) {
      defaultUser.username = user.uid.toString();
      console.log("Attempting to create user...");
      db.collection("users")
        .doc(user.uid)
        .set(defaultUser)
        .then(() => {
          db.collection("users")
            .doc("FriendStore")
            .get()
            .then((friendStoreSnap) => {
              if (friendStoreSnap.exists) {
                let usernames = friendStoreSnap.data().usernames;

                if (!usernames.hasOwnProperty(defaultUser.username)) {
                  usernames[defaultUser.username] = user.uid;
                  updateUsernameJson(usernames, (success) => {
                    if (success) {
                      console.log("User created with ID: " + user.uid);
                      if (callback !== undefined) callback(true);
                    } else {
                      console.error("Error creating user.");
                      if (callback !== undefined) callback(false);
                    }
                  });
                }
              }
            });
        })
        .catch((error) => {
          console.error("Error creating user: ", error);
          if (callback !== undefined) callback(false);
        });
    }
  };
  const updateUsernameJson = (newUsernamesJson, callback) => {
    db.collection("users")
      .doc("FriendStore")
      .update({
        usernames: newUsernamesJson,
      })
      .then(function () {
        console.log(`Successfully updated the friend store.`);
        if (callback !== undefined) callback(true);
      })
      .catch(function (error) {
        console.error("Error updating a friend store: ", error);
        if (callback !== undefined) callback(false);
      });
  };

  React.useEffect(() => {
    if (isElectron()) {
      window.api.receive("fromMain", (data) => {
        console.log(`Received ${data} from main process`);
        if (data.hasOwnProperty("speed")) {
          setUpdateDialog(true);
          setDownloading(true);
          setDownloadProgress(data.percent);
          setDownloadSpeed(data.speed);
          //setDownloadTotal(data.total);
          //setDownloadCurrent(data.transferred);
        }
        if (data === "update-downloaded") {
          setDownloadComplete(true);
        }
      });
    }
    firebase.auth().onAuthStateChanged((tempUser) => {
      props.setLoggedIn(!!tempUser);
      if (tempUser) {
        user = tempUser;
        checkUserExists();

        if (userSet === false) {
          props.setCurrentChannelId("Region", user, db, () => {});
          props.awaitProfileChanges(user, db);
          setUserSet(true);
        }
      } else {
        user = undefined;
      }
    });
  }, []);

  return (
    <Router>
      <div className="App">
        <ThemeProvider theme={props.theme}>
          <CssBaseline />
          <Dialog open={updateDialog}>
            <DialogTitle id="form-dialog-title">An Update is Downloading</DialogTitle>
            {downloading && (
              <DialogContent>
                <Typography variant="h5">Download speed (MB/s): {(downloadSpeed * 0.000001).toString().includes(".") ? (downloadSpeed * 0.000001).toString().split(".")[0] : (downloadSpeed * 0.000001).toString()}.</Typography>
                <Box position="relative" display="inline-flex">
                  <CircularProgress variant="determinate" value={downloadProgress} />
                  <Box top={0} left={0} bottom={0} right={0} position="absolute" display="flex" alignItems="center" justifyContent="center">
                    <Typography variant="caption" component="div" color="textSecondary">{`${Math.round(downloadProgress)}%`}</Typography>
                  </Box>
                </Box>
              </DialogContent>
            )}
            <DialogActions>
              <Button color="primary" onClick={() => window.api.send("toMain", "close-app")} disabled={!downloadComplete}>
                Close and Cancel
              </Button>
              <Button variant="contained" color="secondary" onClick={() => window.api.send("toMain", "start-install")} disabled={!downloadComplete}>
                Close and Install
              </Button>
            </DialogActions>
          </Dialog>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={props.snackbarOpen}
            autoHideDuration={3000}
            onClose={props.setSnackbarClosed}
            message={props.snackbarText}
            action={
              <>
                <IconButton size="small" aria-label="close" color="inherit" onClick={props.setSnackbarClosed}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
          />
          <AppBar
            position="static"
            className={clsx("AppBar", {
              AppBarShift: props.primaryDrawerOpen,
            })}
          >
            <Toolbar
              style={{ WebkitAppRegion: "drag" }}
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
                Skillchat
              </Typography>
              <div
                style={{ WebkitAppRegion: "no-drag" }}
                className={clsx("LoginVisible", {
                  LoginInvisible: props.loggedIn,
                })}
              >
                <LoginRegisterBtn {...props} />
              </div>
              <div
                style={{ WebkitAppRegion: "no-drag" }}
                className={clsx("LoginVisible", {
                  LoginInvisible: !props.loggedIn,
                })}
              >
                <ProfMenu style={{ WebkitAppRegion: "no-drag" }} {...props} />
              </div>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route path="/social">
              <MessagingContainer channels={channels} setChannels={setChannels} checkUserExists={checkUserExists} user={user} database={db} />
            </Route>
            <Route path="/account/settings">
              <SettingsPageContainer user={user} database={db} />
            </Route>
            <Route path="/account/profile">
              <ProfileContainer user={user} database={db} />
            </Route>
            <Route path="/">
              <HomeContainer user={user} database={db} />
            </Route>
          </Switch>
        </ThemeProvider>
      </div>
    </Router>
  );
}

export default App;
