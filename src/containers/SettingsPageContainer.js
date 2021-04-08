import { connect } from "react-redux";
import SettingsPage from "../components/Settings/SettingsPage";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  colors: state.myProfile.colors,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  setColors: (newColors) => dispatch.myProfile.setColors({ colors: newColors }),
  saveColors: (user, database) => dispatch.myProfile.saveColors({ user, database }),
});

const SettingsPageContainer = connect(mapState, mapDispatch)(SettingsPage);
export default SettingsPageContainer;
