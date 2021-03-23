import { connect } from "react-redux";
import MessagingNew from "../components/primary/MessagingNew";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) =>
    dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
});

const MessagingContainer = connect(mapState, mapDispatch)(MessagingNew);
export default MessagingContainer;
