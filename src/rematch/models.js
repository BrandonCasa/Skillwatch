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
