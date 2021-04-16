import { connect } from "react-redux";
import Messaging from "../components/Messaging/Components/Messaging";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  username: state.myProfile.username,
  friends: state.myProfile.friends,
  currentChannelId: state.messaging.currentChannelId,
  currentChannelName: state.messaging.currentChannelName,
  messages: state.messaging.messages,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  setCurrentChannelId: (newId, user, database, callback) => dispatch.messaging.setCurrentChannelId({ newId, user, database, callback }),
});

const MessagingContainer = connect(mapState, mapDispatch)(Messaging);
export default MessagingContainer;
