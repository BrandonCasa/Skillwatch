import { connect } from "react-redux";
import App from "../components/primary/App";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  profilePicture: state.myProfile.profilePicture,
  snackbarOpen: state.snackbar.snackbarOpen,
  snackbarText: state.snackbar.snackbarText,
  status: state.myProfile.status,
  colors: state.myProfile.colors,
  theme: state.myProfile.theme,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  awaitProfileChanges: (user, database) => dispatch.myProfile.awaitProfileChanges({ user, database }),
  setStatus: (newStatus, user, database) => dispatch.myProfile.setStatus({ newStatus, user, database }),
  setSnackbarOpen: () => dispatch.snackbar.setSnackbarOpen(),
  setSnackbarClosed: () => dispatch.snackbar.setSnackbarClosed(),
  setSnackbarText: (newText) => dispatch.snackbar.setSnackbarText(newText),
  setColors: (newColors) => dispatch.myProfile.setColors({ colors: newColors }),
  saveColors: (user, database) => dispatch.myProfile.saveColors({ user, database }),
  setCurrentChannelId: (newId, user, database, callback) => dispatch.messaging.setCurrentChannelId({ newId, user, database, callback }),
});

const AppContainer = connect(mapState, mapDispatch)(App);
export default AppContainer;
