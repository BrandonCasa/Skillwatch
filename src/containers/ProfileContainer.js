import { connect } from "react-redux";
import Profile from "../components/primary/Profile";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
  loggedIn: state.userInformation.loggedIn,
  profilePicture: state.myProfile.profilePicture,
  username: state.myProfile.username,
  bio: state.myProfile.bio,
  colors: state.myProfile.colors,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) => dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
  setLoggedIn: (newLoggedIn) => dispatch.userInformation.setLoggedIn(newLoggedIn),
  setProfilePicture: (newProfilePicture, user, database) => dispatch.myProfile.setProfilePicture({ newProfilePicture, user, database }),
  setUsername: (newUsername, user, database) => dispatch.myProfile.setUsername({ newUsername, user, database }),
  setProfile: (newProfile, user, database) => dispatch.myProfile.setProfile({ newProfile, user, database }),
  setBio: (newBio, user, database) => dispatch.myProfile.setBio({ newBio, user, database }),
  setSnackbarOpen: () => dispatch.snackbar.setSnackbarOpen(),
  setSnackbarClosed: () => dispatch.snackbar.setSnackbarClosed(),
  setSnackbarText: (newText) => dispatch.snackbar.setSnackbarText(newText),
});

const ProfileContainer = connect(mapState, mapDispatch)(Profile);
export default ProfileContainer;
