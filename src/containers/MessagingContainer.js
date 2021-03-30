import { connect } from "react-redux";
import Messaging from "../components/Messaging/Components/Messaging";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) =>
    dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
});

const MessagingContainer = connect(mapState, mapDispatch)(Messaging);
export default MessagingContainer;
