import { connect } from "react-redux";
import App from "../components/primary/App";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  profilePicture: state.myProfile.profilePicture,
  username: state.myProfile.username,
  snackbarOpen: state.snackbar.snackbarOpen,
  snackbarText: state.snackbar.snackbarText,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  setProfilePicture: (newProfilePicture, user, database) => dispatch.myProfile.setProfilePicture({ newProfilePicture, user, database }),
  setUsername: (newUsername, user, database) => dispatch.myProfile.setUsername({ newUsername, user, database }),
  setProfile: (newProfile, user, database) => dispatch.myProfile.setProfile({ newProfile, user, database }),
  awaitProfileChanges: (user, database, callback) => dispatch.myProfile.awaitProfileChanges({ user, database, callback }),
  setSnackbarOpen: () => dispatch.snackbar.setSnackbarOpen(),
  setSnackbarClosed: () => dispatch.snackbar.setSnackbarClosed(),
  setSnackbarText: (newText) => dispatch.snackbar.setSnackbarText(newText),
});

const AppContainer = connect(mapState, mapDispatch)(App);
export default AppContainer;
