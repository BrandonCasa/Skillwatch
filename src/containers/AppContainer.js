import { connect } from "react-redux";
import App from "../components/primary/App";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  profilePicture: state.myProfile.profilePicture,
  snackbarOpen: state.snackbar.snackbarOpen,
  snackbarText: state.snackbar.snackbarText,
  status: state.myProfile.status,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  awaitProfileChanges: (user, database) => dispatch.myProfile.awaitProfileChanges({ user, database }),
  setStatus: (newStatus, user, database) => dispatch.myProfile.setStatus({ newStatus, user, database }),
});

const AppContainer = connect(mapState, mapDispatch)(App);
export default AppContainer;
