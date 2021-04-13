import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

// SCSS
import "./LoggedIn.scss";
// Custom Components
import CurrentChannelTab from "../../CurrentChannel/Components/CurrentChannelTab";
import FriendListTab from "../../Friends/Components/FriendListTab";

function LoggedIn(props) {
  const [currentTab, setCurrentTab] = React.useState(0);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [friends, setFriends] = React.useState([]);

  const changeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const currentTabContent = (props) => {
    switch (currentTab) {
    case 0:
      return <CurrentChannelTab setSnackbarOpen={setSnackbarOpen} setSnackbarText={setSnackbarText} setFriends={setFriends} friends={friends} {...props} />;
    case 1:
      return <FriendListTab setSnackbarOpen={setSnackbarOpen} setSnackbarText={setSnackbarText} setFriends={setFriends} friends={friends} {...props} />;
    case 2:
      return "Blocked List";
    default:
      return "Unknown Tab";
    }
  };

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("friends")) {
            setFriends(snapshot.data().friends);
          }
        }
      });
  }, []);

  return (
    <>
      <AppBar position="static" className="LoggedIn-AppBar">
        <Tabs position="static" value={currentTab} onChange={changeTab} className="LoggedIn-Tabs">
          <Tab label="Channel" />
          <Tab label="Friends List" />
          <Tab label="Blocked List" />
        </Tabs>
      </AppBar>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        message={snackbarText}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={closeSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      />
      <Paper className="LoggedIn-Content">{currentTabContent(props)}</Paper>
    </>
  );
}

export default LoggedIn;
