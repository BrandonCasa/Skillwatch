import React from "react";
import clsx from "clsx";
import Drawer from "@material-ui/core/Drawer";
import AdjustIcon from "@material-ui/icons/Adjust";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import HomeIcon from "@material-ui/icons/Home";
import CheckIcon from "@material-ui/icons/Check";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import GroupIcon from "@material-ui/icons/Group";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import Badge from "@material-ui/core/Badge";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ListSubheader from "@material-ui/core/ListSubheader";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import FilterListIcon from "@material-ui/icons/FilterList";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionActions from "@material-ui/core/AccordionActions";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Link } from "react-router-dom";
import "./MessagingNew.scss";
import { DriveEtaOutlined } from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import DoneIcon from "@material-ui/icons/Done";
import WcIcon from "@material-ui/icons/Wc";
import SportsEsportsIcon from "@material-ui/icons/SportsEsports";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

function FriendInList(props) {
  const [status, setStatus] = React.useState("Error");
  const [username, setUsername] = React.useState("Error");
  const [bio, setBio] = React.useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
  const [shouldRender, setShouldRender] = React.useState(false);

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.friendId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setShouldRender(true);
          if (snapshot.data().hasOwnProperty("status"))
            setStatus(snapshot.data().status);
          if (snapshot.data().hasOwnProperty("username"))
            setUsername(snapshot.data().username);
          if (snapshot.data().hasOwnProperty("bio"))
            setBio(snapshot.data().bio);
        }
      });
  }, []);

  if (shouldRender) {
    return (
      <ListItem>
        <Accordion className={`Accordion Accordion${status}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${username} (${status})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Typography className="Header" variant="h6">
                Bio:
              </Typography>
              <Typography variant="subtitle1">{bio}</Typography>
              <Typography className="Header" variant="h6">
                Info:
              </Typography>
              <div>
                <Chip
                  icon={<FaceIcon />}
                  label="Brandon"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<WcIcon />}
                  label="Male"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<SportsEsportsIcon />}
                  label="Overwatch"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<SportsEsportsIcon />}
                  label="Warframe"
                  style={{ marginRight: "8px" }}
                />
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </ListItem>
    );
  } else {
    return <React.Fragment />;
  }
}

function Username(props) {
  const [username, setUsername] = React.useState("Error");

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.userId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setUsername(snapshot.data().username);
        }
      });
  }, []);

  return username;
}

function FriendRequests(props) {
  const [friendRequests, setFriendRequests] = React.useState([]);

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("incomingFriendRequests")) {
            setFriendRequests(snapshot.data().incomingFriendRequests);
          }
        }
      });
  }, []);

  return friendRequests.map((friendId, id) => (
    <React.Fragment key={id}>
      <ListItem
        className="FriendRequest"
        button
        onClick={() => {
          props.setSelectedFriendRequestId(friendId);
          props.handleClickOpenAcceptFriend();
        }}
      >
        <ListItemIcon>
          <AdjustIcon />
        </ListItemIcon>
        <ListItemText primary={<Username {...props} userId={friendId} />} />
      </ListItem>
      <Divider variant="inset" />
    </React.Fragment>
  ));
}

function FriendsListTab(props) {
  const [currentSorting, setCurrentSorting] = React.useState("OnlineFirst");
  const [friends, setFriends] = React.useState([]);
  const [addFriendOpen, setAddFriendOpen] = React.useState(false);
  const [acceptFriendOpen, setAcceptFriendOpen] = React.useState(false);
  const [selectedFriendRequestId, setSelectedFriendRequestId] = React.useState(
    ""
  );

  const handleClickOpenAddFriend = () => {
    setAddFriendOpen(true);
  };

  const handleCloseAddFriend = () => {
    setAddFriendOpen(false);
  };

  const handleClickOpenAcceptFriend = () => {
    setAcceptFriendOpen(true);
  };

  const handleCloseAcceptFriend = () => {
    setAcceptFriendOpen(false);
  };

  const updateFieldToUser = (userId, fieldName, fieldValue, callback) => {
    props.database
      .collection("users")
      .doc(userId)
      .update({
        [fieldName]: fieldValue,
      })
      .then(function () {
        console.log(
          `Successfully updated the user's field called "${fieldName}" to be "${fieldValue}"`
        );
        if (callback !== undefined) callback(true);
      })
      .catch(function (error) {
        console.error("Error updating a user's field: ", error);
        if (callback !== undefined) callback(false);
      });
  };
  const submitAddFriend = (event) => {
    event.preventDefault();

    let inputEl = document.getElementById("AddFriendName");

    props.database
      .collection("users")
      .doc("FriendStore")
      .get()
      .then((friendStoreSnap) => {
        if (friendStoreSnap.exists) {
          let usernames = friendStoreSnap.data().usernames;

          if (usernames.hasOwnProperty(inputEl.value)) {
            props.database
              .collection("users")
              .doc(props.user.uid)
              .get()
              .then((userSnapshot) => {
                if (userSnapshot.exists) {
                  if (
                    userSnapshot.data().hasOwnProperty("outgoingFriendRequests")
                  ) {
                    let tempOutgoing = userSnapshot.data()
                      .outgoingFriendRequests;

                    if (!tempOutgoing.includes(usernames[inputEl.value])) {
                      tempOutgoing.push(usernames[inputEl.value]);

                      updateFieldToUser(
                        props.user.uid,
                        "outgoingFriendRequests",
                        tempOutgoing,
                        (successA) => {
                          if (successA) {
                            tempOutgoing = userSnapshot.data()
                              .outgoingFriendRequests;
                            tempOutgoing.push(props.user.uid);

                            updateFieldToUser(
                              usernames[inputEl.value],
                              "incomingFriendRequests",
                              tempOutgoing,
                              (successB) => {
                                if (successB) {
                                  console.log(
                                    "Sent friend request to user with id: " +
                                      usernames[inputEl.value]
                                  );
                                } else {
                                  console.log(
                                    "Error sending friend request to user with id: " +
                                      usernames[inputEl.value]
                                  );
                                }
                              }
                            );
                          } else {
                            console.log(
                              "Error sending friend request to user with id: " +
                                usernames[inputEl.value]
                            );
                          }
                        }
                      );
                    } else {
                      console.log(
                        "Friend request already sent to user with id: " +
                          usernames[inputEl.value]
                      );
                    }
                  }
                }
              });
          }
        }
      });

    setAddFriendOpen(false);
  };

  const acceptFriendRequest = () => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          let tempArray = snapshot.data().incomingFriendRequests;
          const index = tempArray.indexOf(selectedFriendRequestId);
          if (index > -1) {
            tempArray.splice(index, 1);
          }

          let oldFriendsList = snapshot.data().friends;
          oldFriendsList.push(selectedFriendRequestId);

          props.database
            .collection("users")
            .doc(props.user.uid)
            .update({
              friends: oldFriendsList,
              incomingFriendRequests: tempArray,
            })
            .then(function () {
              props.database
                .collection("users")
                .doc(selectedFriendRequestId)
                .get()
                .then((snapshotOut) => {
                  if (snapshotOut.exists) {
                    tempArray = snapshotOut.data().outgoingFriendRequests;
                    const index = tempArray.indexOf(props.user.uid);
                    if (index > -1) {
                      tempArray.splice(index, 1);
                    }

                    oldFriendsList = snapshotOut.data().friends;
                    oldFriendsList.push(props.user.uid);

                    props.database
                      .collection("users")
                      .doc(selectedFriendRequestId)
                      .update({
                        friends: oldFriendsList,
                        outgoingFriendRequests: tempArray,
                      })
                      .then(function () {
                        console.error("Successfully accepted friend request.");
                      })
                      .catch(function (error) {
                        console.error("Error adding friend: ", error);
                      });
                  }
                });
            })
            .catch(function (error) {
              console.error("Error adding friend: ", error);
            });
        }
        handleCloseAcceptFriend();
      });
  };

  const declineFriendRequest = () => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          let tempArray = snapshot.data().incomingFriendRequests;
          const index = tempArray.indexOf(selectedFriendRequestId);
          if (index > -1) {
            tempArray.splice(index, 1);
          }

          props.database
            .collection("users")
            .doc(props.user.uid)
            .update({
              incomingFriendRequests: tempArray,
            })
            .then(function () {
              props.database
                .collection("users")
                .doc(selectedFriendRequestId)
                .get()
                .then((snapshotOut) => {
                  if (snapshotOut.exists) {
                    tempArray = snapshotOut.data().outgoingFriendRequests;
                    const index = tempArray.indexOf(props.user.uid);
                    if (index > -1) {
                      tempArray.splice(index, 1);
                    }

                    props.database
                      .collection("users")
                      .doc(selectedFriendRequestId)
                      .update({
                        outgoingFriendRequests: tempArray,
                      })
                      .then(function () {
                        console.error("Successfully declined friend request.");
                      })
                      .catch(function (error) {
                        console.error(
                          "Error declining friend request: ",
                          error
                        );
                      });
                  }
                });
            })
            .catch(function (error) {
              console.error("Error declining friend request: ", error);
            });
        }
        handleCloseAcceptFriend();
      });
  };

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("friends"))
            setFriends(snapshot.data().friends);
        } else {
          setFriends([]);
        }
      });
  }, []);

  return (
    <div className="Friends">
      <Dialog open={addFriendOpen} onClose={handleCloseAddFriend}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new friend, please input their username.
          </DialogContentText>
          <form noValidate autoComplete="off" onSubmit={submitAddFriend}>
            <TextField
              id="AddFriendName"
              color="secondary"
              margin="dense"
              label="Friend Name"
              type="text"
              fullWidth
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddFriend} color="primary">
            Cancel
          </Button>
          <Button
            onClick={submitAddFriend}
            color="secondary"
            variant="contained"
          >
            Add Friend
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={acceptFriendOpen} onClose={handleCloseAcceptFriend}>
        <DialogTitle>Accept/Decline Friend Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Choose whether to accept or decline a new friend request.
          </DialogContentText>
          <List>
            <FriendInList
              friendId={selectedFriendRequestId}
              {...props}
              key={0}
            />
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAcceptFriend} color="primary">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={declineFriendRequest}
          >
            Decline
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={acceptFriendRequest}
          >
            Accept
          </Button>
        </DialogActions>
      </Dialog>
      <List className="FriendsList">
        {friends.map((friendId, id) => (
          <FriendInList friendId={friendId} {...props} key={id} />
        ))}
      </List>
      <div className="FriendRightBar">
        <Paper className="FriendSorting" variant="outlined">
          <List
            className="FriendsSortList"
            subheader={
              <ListSubheader component="div">Friend Sorting</ListSubheader>
            }
          >
            <Divider />
            <ListItem
              button
              disabled={currentSorting === "OnlineFirst"}
              onClick={() => setCurrentSorting("OnlineFirst")}
            >
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText primary="Online (First)" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem
              button
              disabled={currentSorting === "OnlineLast"}
              onClick={() => setCurrentSorting("OnlineLast")}
            >
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText primary="Online (Last)" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem
              button
              disabled={currentSorting === "NameAZ"}
              onClick={() => setCurrentSorting("NameAZ")}
            >
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText primary="Name (A-Z)" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem
              button
              disabled={currentSorting === "NameZA"}
              onClick={() => setCurrentSorting("NameZA")}
            >
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText primary="Name (Z-A)" />
            </ListItem>
          </List>
        </Paper>
        <Paper className="FriendActions" variant="outlined">
          <List
            className="FriendsActionsList"
            subheader={
              <ListSubheader component="div">Friend Actions</ListSubheader>
            }
          >
            <Divider />
            <ListItem button onClick={handleClickOpenAddFriend}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Friend" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button>
              <ListItemIcon>
                <DeleteForeverIcon />
              </ListItemIcon>
              <ListItemText primary="Remove Selected" />
            </ListItem>
          </List>
        </Paper>
        <Paper className="FriendRequests" variant="outlined">
          <List
            className="FriendsRequestsList"
            subheader={
              <ListSubheader component="div">
                Friend Requests (Incoming)
              </ListSubheader>
            }
          >
            <Divider />
            <FriendRequests
              handleClickOpenAcceptFriend={handleClickOpenAcceptFriend}
              setSelectedFriendRequestId={setSelectedFriendRequestId}
              {...props}
            />
          </List>
        </Paper>
      </div>
    </div>
  );
}

function MessagingLoggedIn(props) {
  const [currentChannel, setCurrentChannel] = React.useState("Region");
  const [currentTab, setCurrentTab] = React.useState(1);

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const currentTabContent = (props) => {
    switch (currentTab) {
      case 0:
        return "Channels";
      case 1:
        return <FriendsListTab {...props} />;
      case 2:
        return "Blocked List";
      default:
        return "Unknown Tab";
    }
  };

  return (
    <>
      <AppBar position="static" className="ContentAppBar">
        <Tabs
          position="static"
          value={currentTab}
          onChange={handleChangeTab}
          className="Tabs"
        >
          <Tab label="Channels" />
          <Tab label="Friends List" />
          <Tab label="Blocked List" />
        </Tabs>
      </AppBar>
      <Paper className="TabContent">{currentTabContent(props)}</Paper>
    </>
  );
}

function Messaging(props) {
  return (
    <div className="Messaging">
      <Drawer
        className="Drawer"
        variant="persistent"
        anchor="left"
        open={props.primaryDrawerOpen}
        classes={{
          paper: "DrawerPaper",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            className={"MenuButton"}
            color="inherit"
            onClick={() => {
              props.setPrimaryDrawerOpen(false);
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" className="Title">
            Skillwatch
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          <ListItem button key={"Home"} component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary={"Home"} />
          </ListItem>
          <ListItem button key={"Tracking"}>
            <ListItemIcon>
              <TrendingUpIcon />
            </ListItemIcon>
            <ListItemText primary={"Tracking"} />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem
            button
            key={"Messaging"}
            disabled={true}
            component={Link}
            to="/messaging"
          >
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary={"Messaging"} />
          </ListItem>
        </List>
      </Drawer>
      <div
        className={clsx("Content", {
          ContentClosed: !props.primaryDrawerOpen,
        })}
      >
        {props.loggedIn ? (
          <MessagingLoggedIn {...props} />
        ) : (
          "Please Login to use messaging"
        )}
      </div>
    </div>
  );
}

export default Messaging;
