import { Component } from "react";
import { connect } from "react-redux";
import App from "../components/primary/App";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) =>
    dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
});

const AppContainer = connect(mapState, mapDispatch)(App);
export default AppContainer;
