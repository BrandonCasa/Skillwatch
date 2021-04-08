import { connect } from "react-redux";
import SettingsPage from "../components/Settings/SettingsPage";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
});

const SettingsPageContainer = connect(mapState, mapDispatch)(SettingsPage);
export default SettingsPageContainer;
