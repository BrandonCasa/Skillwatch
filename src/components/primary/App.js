import React from "react";

import clsx from "clsx";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.scss";

import HomeContainer from "../../containers/HomeContainer";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

function App(props) {
  const [profBtnAnchorEl, setProfBtnAnchorEl] = React.useState(null);
  const profBtnOpen = Boolean(profBtnAnchorEl);

  const handleMenu = (event) => {
    setProfBtnAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setProfBtnAnchorEl(null);
  };

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar
          position="static"
          className={clsx("AppBar", {
            AppBarShift: props.primaryDrawerOpen,
          })}
        >
          <Toolbar
            className={clsx("Toolbar", {
              ToolbarShift: props.primaryDrawerOpen,
            })}
          >
            <IconButton
              edge="start"
              className={clsx("MenuButtonVisible", {
                MenuButtonInvisible: props.primaryDrawerOpen,
              })}
              color="inherit"
              onClick={() => {
                props.setPrimaryDrawerOpen(true);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              className={clsx("TitleVisible", {
                TitleInvisible: props.primaryDrawerOpen,
              })}
            >
              Skillwatch
            </Typography>
            <IconButton onClick={handleMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={profBtnAnchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={profBtnOpen}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Router>
          <Switch>
            <Route path="/">
              <HomeContainer />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
