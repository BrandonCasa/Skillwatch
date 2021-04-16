import { createMuiTheme } from "@material-ui/core/styles";

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

const defaultMessaging = {
  currentChannelId: "none",
  currentChannelName: "none",
  savedUsernames: {},
  messages: { none: [] },
};

export const messaging = {
  state: defaultMessaging, // initial state
  reducers: {
    // handle state changes with pure functions
    setCurrentChannelIdName(state, payload) {
      return {
        ...state,
        currentChannelId: payload.newId,
        currentChannelName: payload.newName,
      };
    },
    saveUsername(state, payload) {
      let oldSavedUsernames = { ...state.savedUsernames };
      oldSavedUsernames[payload.userId] = payload.userName;

      return {
        ...state,
        savedUsernames: oldSavedUsernames,
      };
    },
    setMessages(state, payload) {
      let oldMessages = { ...state.messages };
      oldMessages[payload.channelId] = payload.newMessages;

      return {
        ...state,
        messages: oldMessages,
      };
    },
  },
  effects: (dispatch) => {
    return {
      setCurrentChannelId(payload, state) {
        if (payload.newId.length === 28) {
          if (!state.messaging.savedUsernames.hasOwnProperty(payload.newId)) {
            payload.database
              .collection("users")
              .doc(payload.newId)
              .onSnapshot((snapshot) => {
                dispatch.messaging.saveUsername({ userId: payload.newId, userName: snapshot.data().username });
              });
            let docRefA = payload.database.collection("chatChannels").doc(`${payload.user.uid} - ${payload.newId}`);
            let docRefB = payload.database.collection("chatChannels").doc(`${payload.newId} - ${payload.user.uid}`);
            docRefA.get().then((docA) => {
              if (docA.exists) {
                // If `${props.user.uid} - ${friendId}` DOES exist
                payload.database
                  .collection("chatChannels")
                  .doc(`${payload.user.uid} - ${payload.newId}`)
                  .get()
                  .then((chatSnapshot) => {
                    dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                    dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: payload.newId });
                    payload.callback();
                  });
                payload.database
                  .collection("chatChannels")
                  .doc(`${payload.user.uid} - ${payload.newId}`)
                  .onSnapshot((chatSnapshot) => {
                    dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                  });
              } else {
                // If `${props.user.uid} - ${friendId}` DOES NOT exist
                docRefB.get().then((docB) => {
                  if (docB.exists) {
                    // If `${friendId} - ${props.user.uid}` DOES exist
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.newId} - ${payload.user.uid}`)
                      .get()
                      .then((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                        dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: payload.newId });
                        payload.callback();
                      });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.newId} - ${payload.user.uid}`)
                      .onSnapshot((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                      });
                  } else {
                    // If `${friendId} - ${props.user.uid}` DOES NOT exist
                    payload.database.collection("chatChannels").doc(`${payload.user.uid} - ${payload.newId}`).set({ messages: [] });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.user.uid} - ${payload.newId}`)
                      .get()
                      .then((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                        dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: payload.newId });
                        payload.callback();
                      });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.user.uid} - ${payload.newId}`)
                      .onSnapshot((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                      });
                  }
                });
              }
            });
          } else {
            payload.database
              .collection("users")
              .doc(payload.newId)
              .get()
              .then((snapshot) => {
                dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: state.messaging.savedUsernames[payload.newId] });
                payload.callback();
              });
          }
        } else if (payload.newId.length === 59) {
          let theId = payload.newId;
          if (theId.split(" - ")[0] === payload.user.uid) {
            theId = theId.split(" - ")[1];
          } else {
            theId = theId.split(" - ")[0];
          }

          if (!state.messaging.savedUsernames.hasOwnProperty(theId)) {
            payload.database
              .collection("users")
              .doc(theId)
              .onSnapshot((snapshot) => {
                dispatch.messaging.saveUsername({ userId: theId, userName: snapshot.data().username });
              });
            let docRefA = payload.database.collection("chatChannels").doc(`${payload.user.uid} - ${theId}`);
            let docRefB = payload.database.collection("chatChannels").doc(`${theId} - ${payload.user.uid}`);
            docRefA.get().then((docA) => {
              if (docA.exists) {
                // If `${props.user.uid} - ${friendId}` DOES exist
                payload.database
                  .collection("chatChannels")
                  .doc(`${payload.user.uid} - ${theId}`)
                  .get()
                  .then((chatSnapshot) => {
                    dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                    dispatch.messaging.setCurrentChannelIdName({ newId: theId, newName: theId });
                    payload.callback();
                  });
                payload.database
                  .collection("chatChannels")
                  .doc(`${payload.user.uid} - ${theId}`)
                  .onSnapshot((chatSnapshot) => {
                    dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                  });
              } else {
                // If `${props.user.uid} - ${friendId}` DOES NOT exist
                docRefB.get().then((docB) => {
                  if (docB.exists) {
                    // If `${friendId} - ${props.user.uid}` DOES exist
                    payload.database
                      .collection("chatChannels")
                      .doc(`${theId} - ${payload.user.uid}`)
                      .get()
                      .then((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                        dispatch.messaging.setCurrentChannelIdName({ newId: theId, newName: theId });
                        payload.callback();
                      });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${theId} - ${payload.user.uid}`)
                      .onSnapshot((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                      });
                  } else {
                    // If `${friendId} - ${props.user.uid}` DOES NOT exist
                    payload.database.collection("chatChannels").doc(`${payload.user.uid} - ${theId}`).set({ messages: [] });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.user.uid} - ${theId}`)
                      .get()
                      .then((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                        dispatch.messaging.setCurrentChannelIdName({ newId: theId, newName: theId });
                        payload.callback();
                      });
                    payload.database
                      .collection("chatChannels")
                      .doc(`${payload.user.uid} - ${theId}`)
                      .onSnapshot((chatSnapshot) => {
                        dispatch.messaging.setMessages({ channelId: theId, newMessages: chatSnapshot.data().messages });
                      });
                  }
                });
              }
            });
          } else {
            payload.database
              .collection("users")
              .doc(theId)
              .get()
              .then((snapshot) => {
                dispatch.messaging.setCurrentChannelIdName({ newId: theId, newName: state.messaging.savedUsernames[theId] });
                payload.callback();
              });
          }
        } else {
          if (!state.messaging.savedUsernames.hasOwnProperty(payload.newId)) {
            dispatch.messaging.saveUsername({ userId: payload.newId, userName: payload.newId });
            payload.database
              .collection("chatChannels")
              .doc(payload.newId)
              .get()
              .then((chatSnapshot) => {
                dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
                dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: payload.newId });
                payload.callback();
              });
            payload.database
              .collection("chatChannels")
              .doc(payload.newId)
              .onSnapshot((chatSnapshot) => {
                dispatch.messaging.setMessages({ channelId: payload.newId, newMessages: chatSnapshot.data().messages });
              });
          } else {
            dispatch.messaging.setCurrentChannelIdName({ newId: payload.newId, newName: payload.newId });
            console.log("e");
            payload.callback();
          }
        }
      },
    };
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
      return {
        ...state,
        loggedIn: payload,
      };
    },
  },
};

const defaultMyProfile = {
  friends: [],
  profilePicture: "",
  username: "",
  bio: "",
  status: "Error",
  colors: {
    primary: {
      light: "#757ce8",
      main: "#3f50b5",
      dark: "#002884",
      contrastText: "#fff",
    },
    secondary: {
      light: "#ff7961",
      main: "#f44336",
      dark: "#ba000d",
      contrastText: "#000",
    },
  },
  theme: createMuiTheme({
    palette: {
      type: "dark",
      primary: {
        light: "#757ce8",
        main: "#3f50b5",
        dark: "#002884",
        contrastText: "#fff",
      },
      secondary: {
        light: "#ff7961",
        main: "#f44336",
        dark: "#ba000d",
        contrastText: "#000",
      },
    },
  }),
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
    setColors(state, payload) {
      let theColors = { ...state.colors };

      if (payload.colors.hasOwnProperty("primary")) {
        if (payload.colors.primary.hasOwnProperty("light")) {
          if (payload.colors.primary.light.hasOwnProperty("hex")) {
            theColors.primary.light = payload.colors.primary.light.hex;
          } else {
            theColors.primary.light = payload.colors.primary.light;
          }
        }
        if (payload.colors.primary.hasOwnProperty("main")) {
          if (payload.colors.primary.main.hasOwnProperty("hex")) {
            theColors.primary.main = payload.colors.primary.main.hex;
          } else {
            theColors.primary.main = payload.colors.primary.main;
          }
        }
        if (payload.colors.primary.hasOwnProperty("dark")) {
          if (payload.colors.primary.dark.hasOwnProperty("hex")) {
            theColors.primary.dark = payload.colors.primary.dark.hex;
          } else {
            theColors.primary.dark = payload.colors.primary.dark;
          }
        }
        if (payload.colors.primary.hasOwnProperty("contrastText")) {
          if (payload.colors.primary.contrastText.hasOwnProperty("hex")) {
            theColors.primary.contrastText = payload.colors.primary.contrastText.hex;
          } else {
            theColors.primary.contrastText = payload.colors.primary.contrastText;
          }
        }
      }
      if (payload.colors.hasOwnProperty("secondary")) {
        if (payload.colors.secondary.hasOwnProperty("light")) {
          if (payload.colors.secondary.light.hasOwnProperty("hex")) {
            theColors.secondary.light = payload.colors.secondary.light.hex;
          } else {
            theColors.secondary.light = payload.colors.secondary.light;
          }
        }
        if (payload.colors.secondary.hasOwnProperty("main")) {
          if (payload.colors.secondary.main.hasOwnProperty("hex")) {
            theColors.secondary.main = payload.colors.secondary.main.hex;
          } else {
            theColors.secondary.main = payload.colors.secondary.main;
          }
        }
        if (payload.colors.secondary.hasOwnProperty("dark")) {
          if (payload.colors.secondary.dark.hasOwnProperty("hex")) {
            theColors.secondary.dark = payload.colors.secondary.dark.hex;
          } else {
            theColors.secondary.dark = payload.colors.secondary.dark;
          }
        }
        if (payload.colors.secondary.hasOwnProperty("contrastText")) {
          if (payload.colors.secondary.contrastText.hasOwnProperty("hex")) {
            theColors.secondary.contrastText = payload.colors.secondary.contrastText.hex;
          } else {
            theColors.secondary.contrastText = payload.colors.secondary.contrastText;
          }
        }
      }

      /*
      await payload.database.collection("users").doc(payload.user.uid).update({
        colors: theColors,
      });
      */
      const theTheme = createMuiTheme({
        palette: {
          type: "dark",
          ...theColors,
        },
      });
      return {
        ...state,
        colors: theColors,
        theme: theTheme,
      };
    },
  },
  effects: (dispatch) => {
    return {
      async saveColors(payload, state) {
        await payload.database.collection("users").doc(payload.user.uid).update({
          colors: state.myProfile.colors,
        });
      },
      async setStatus(payload, state) {
        await payload.database.collection("users").doc(payload.user.uid).update({
          status: payload.newStatus,
        });

        return {
          ...state,
          myProfile: {
            status: payload.newStatus,
          },
        };
      },
      async setBio(payload, state) {
        await payload.database.collection("users").doc(payload.user.uid).update({
          bio: payload.newBio,
        });

        return {
          ...state,
          myProfile: {
            bio: payload.newBio,
          },
        };
      },
      async setProfilePicture(payload, state) {
        await payload.database.collection("users").doc(payload.user.uid).update({
          pfp: payload.newProfilePicture,
        });

        return {
          ...state,
          myProfile: {
            profilePicture: payload.newProfilePicture,
          },
        };
      },
      async setUsername(payload, state) {
        let friendStoreSnap = await payload.database.collection("users").doc("FriendStore").get();
        let usernames = friendStoreSnap.data().usernames;
        delete usernames[state.myProfile.username];
        usernames[payload.newUsername] = payload.user.uid;

        let snapshot = await payload.database.collection("users").doc("FriendStore").get();

        if (!snapshot.data().usernames.hasOwnProperty(payload.newUsername)) {
          await payload.database.collection("users").doc(payload.user.uid).update({
            username: payload.newUsername,
          });
          await payload.database.collection("users").doc("FriendStore").update({
            usernames: usernames,
          });
        }

        return {
          ...state,
          myProfile: {
            username: payload.newUsername,
          },
        };
      },
      awaitProfileChanges(payload, state) {
        payload.database
          .collection("users")
          .doc(payload.user.uid)
          .onSnapshot((snapshot) => {
            const theTheme = createMuiTheme({
              palette: {
                type: "dark",
                ...snapshot.data().colors,
              },
            });

            dispatch.myProfile.setProfile({
              friends: snapshot.data().friends,
              username: snapshot.data().username,
              profilePicture: snapshot.data().pfp,
              bio: snapshot.data().bio,
              status: snapshot.data().status,
              colors: snapshot.data().colors,
              theme: theTheme,
            });
          });
      },
    };
  },
};
