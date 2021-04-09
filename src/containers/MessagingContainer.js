import { connect } from "react-redux";
import Messaging from "../components/Messaging/Components/Messaging";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  username: state.myProfile.username,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
});

const MessagingContainer = connect(mapState, mapDispatch)(Messaging);
export default MessagingContainer;
