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
