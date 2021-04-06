const defaultPrimaryDrawerOpen = {
  open: false,
};

export const primaryDrawerOpen = {
  state: defaultPrimaryDrawerOpen, // initial state
  reducers: {
    // handle state changes with pure functions
    setPrimaryDrawerOpen(state, payload) {
      return {
        ...state,
        open: payload,
      };
    },
  },
};

const defaultSnackbar = {
  snackbarOpen: false,
  snackbarText: "",
};

export const snackbar = {
  state: defaultSnackbar, // initial state
  reducers: {
    // handle state changes with pure functions
    setSnackbarOpen(state, payload) {
      return {
        ...state,
        snackbarOpen: true,
      };
    },
    setSnackbarClosed(state, payload) {
      return {
        ...state,
        snackbarOpen: false,
      };
    },
    setSnackbarText(state, payload) {
      return {
        ...state,
        snackbarText: payload,
      };
    },
  },
};

const defaultUserInformation = {
  loggedIn: false,
};

export const userInformation = {
  state: defaultUserInformation, // initial state
  reducers: {
    // handle state changes with pure functions
    setLoggedIn(state, payload) {
      console.log(payload);
      return {
        ...state,
        loggedIn: payload,
      };
    },
  },
};

const defaultMyProfile = {
  profilePicture: "",
  username: "",
};

export const myProfile = {
  state: defaultMyProfile, // initial state
  reducers: {
    // handle state changes with pure functions
    setProfile(state, payload) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  effects: (dispatch) => {
    return {
      async setProfilePicture(payload, state) {
        await payload.database.collection("users").doc(payload.user.uid).update({
          pfp: payload.newProfilePicture,
        });
        dispatch.snackbar.setSnackbarOpen();
        dispatch.snackbar.setSnackbarText("Profile Picture Updated.");

        return {
          ...state,
          profilePicture: payload.newProfilePicture,
        };
      },
      async setUsername(payload, state) {
        let friendStoreSnap = await payload.database.collection("users").doc("FriendStore").get();
        let usernames = friendStoreSnap.data().usernames;
        delete usernames[state.username];
        usernames[payload.newUsername] = payload.user.uid;

        await payload.database.collection("users").doc(payload.user.uid).update({
          username: payload.newUsername,
        });
        await payload.database.collection("users").doc("FriendStore").update({
          usernames: usernames,
        });
        dispatch.snackbar.setSnackbarOpen();
        dispatch.snackbar.setSnackbarText("Username Updated.");

        return {
          ...state,
          username: payload.newUsername,
        };
      },
      awaitProfileChanges(payload, state) {
        payload.database
          .collection("users")
          .doc(payload.user.uid)
          .onSnapshot((snapshot) => {
            payload.callback(snapshot);
            dispatch.myProfile.setProfile({ username: snapshot.data().username, profilePicture: snapshot.data().pfp });
          });
      },
    };
  },
};
