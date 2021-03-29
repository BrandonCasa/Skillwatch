import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import AppContainer from "./containers/AppContainer";
import reportWebVitals from "./reportWebVitals";

import { Provider } from "react-redux";
import store from "./rematch/store";

import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase";
firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
