import { connect } from "react-redux";
import Profile from "../components/primary/Profile";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) =>
    dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
});

const ProfileContainer = connect(mapState, mapDispatch)(Profile);
export default ProfileContainer;
