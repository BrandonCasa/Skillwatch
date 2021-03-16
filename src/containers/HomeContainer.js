import { Component } from "react";
import { connect } from "react-redux";
import Home from "../components/primary/Home";

const mapState = (state) => ({
  primaryDrawerOpen: state.primaryDrawerOpen.open,
});

const mapDispatch = (dispatch) => ({
  setPrimaryDrawerOpen: (newDrawerOpen) =>
    dispatch.primaryDrawerOpen.setPrimaryDrawerOpen(newDrawerOpen),
});

const HomeContainer = connect(mapState, mapDispatch)(Home);
export default HomeContainer;
