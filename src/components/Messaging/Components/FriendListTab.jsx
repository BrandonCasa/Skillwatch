import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import ListSubheader from "@material-ui/core/ListSubheader";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import FilterListIcon from "@material-ui/icons/FilterList";
import Badge from "@material-ui/core/Badge";
// SCSS
import "./FriendListTab.scss";
// Custom Components
import FriendInList from "./FriendInList";

function FriendListTab(props) {
  const [currentSorting, setCurrentSorting] = React.useState("OnlineFirst");
  const [addFriendOpen, setAddFriendOpen] = React.useState(false);
  const [areYouSureOpen, setAreYouSureOpen] = React.useState(false);
  const [acceptFriendsOpen, setAcceptFriendsOpen] = React.useState(false);
  const [selectedRequests, setSelectedRequests] = React.useState([]);
  const [pendingRequests, setPendingRequests] = React.useState([]);

  const closeAddFriend = () => {
    setAddFriendOpen(false);
  };
  const openAddFriend = () => {
    setAddFriendOpen(true);
  };
  const closeAreYouSure = () => {
    setAreYouSureOpen(false);
  };
  const openAreYouSure = () => {
    if (selectedRequests.length > 0) {
      setAreYouSureOpen(true);
    } else {
      props.setSnackbarText(`No friends are selected.`);
      props.setSnackbarOpen(true);
    }
  };
  const closeAcceptFriends = () => {
    setAcceptFriendsOpen(false);
  };
  const openAcceptFriends = () => {
    setSelectedRequests([]);
    setAcceptFriendsOpen(true);
  };
  const getFriendStore = (callback) => {
    props.database
      .collection("users")
      .doc("FriendStore")
      .get()
      .then((friendStoreSnap) => {
        callback(friendStoreSnap);
      });
  };
  const getUser = (userId, callback) => {
    props.database
      .collection("users")
      .doc(userId)
      .get()
      .then((userSnap) => {
        callback(userSnap);
      });
  };
  const updateFieldToUser = (userId, field, newVal, callback) => {
    props.database
      .collection("users")
      .doc(userId)
      .update({
        [field]: newVal,
      })
      .then(() => {
        callback();
      });
  };
  const removeSelected = (user) => {
    let current = 0;
    const removeSelf = (oldFriends, friendId, callback) => {
      let newFriends = oldFriends;

      const index = newFriends.indexOf(friendId);
      if (index > -1) {
        newFriends.splice(index, 1);
      }
      callback(newFriends);
    };
    const removeOther = (otherId, callback) => {
      getUser(otherId, (otherSnap) => {
        let newFriends = otherSnap.data().friends;

        const index = newFriends.indexOf(props.user.uid);
        if (index > -1) {
          newFriends.splice(index, 1);
        }

        updateFieldToUser(otherId, "friends", newFriends, callback);
      });
    };

    getUser(props.user.uid, (selfSnap) => {
      let oldFriends = selfSnap.data().friends;

      selectedRequests.forEach((friendId) => {
        removeOther(friendId, () => {
          removeSelf(oldFriends, friendId, (newFriends) => {
            oldFriends = newFriends;
            current++;
            if (current === selectedRequests.length) {
              updateFieldToUser(props.user.uid, "friends", newFriends, () => {
                setSelectedRequests([]);
                props.setSnackbarText(`Selected friends removed.`);
                props.setSnackbarOpen(true);
                setAreYouSureOpen(false);
              });
            }
          });
        });
      });
    });
  };
  const addFriend = (event) => {
    event.preventDefault();
    let inputEl = document.getElementById("AddFriendName");
    const addOutgoingFriendToSelf = (selfUser, usernameStore, callback) => {
      getUser(selfUser.uid, (selfSnap) => {
        if (
          selfSnap.exists &&
          selfSnap.data().hasOwnProperty("friends") &&
          !selfSnap.data().friends.includes(usernameStore[inputEl.value])
        ) {
          if (selfSnap.data().hasOwnProperty("outgoingFriendRequests")) {
            let tempOutgoing = selfSnap.data().outgoingFriendRequests;

            if (!tempOutgoing.includes(usernameStore[inputEl.value])) {
              tempOutgoing.push(usernameStore[inputEl.value]);

              updateFieldToUser(
                selfUser.uid,
                "outgoingFriendRequests",
                tempOutgoing,
                () => {
                  callback();
                }
              );
            } else {
              props.setSnackbarText(`Already sent friend request.`);
              props.setSnackbarOpen(true);
            }
          }
        } else if (
          selfSnap.exists &&
          selfSnap.data().hasOwnProperty("friends") &&
          selfSnap.data().friends.includes(usernameStore[inputEl.value])
        ) {
          props.setSnackbarText(`You are already friends.`);
          props.setSnackbarOpen(true);
        }
      });
    };
    const addIncomingFriendToOther = (
      selfUser,
      otherUsername,
      usernameStore,
      callback
    ) => {
      getUser(usernameStore[otherUsername], (otherSnap) => {
        if (
          otherSnap.exists &&
          otherSnap.data().hasOwnProperty("incomingFriendRequests")
        ) {
          let tempIncoming = otherSnap.data().incomingFriendRequests;

          if (!tempIncoming.includes(usernameStore[otherUsername])) {
            tempIncoming.push(selfUser.uid);

            updateFieldToUser(
              usernameStore[otherUsername],
              "incomingFriendRequests",
              tempIncoming,
              () => {
                callback();
              }
            );
          }
        }
      });
    };
    getFriendStore((friendStoreSnap) => {
      if (friendStoreSnap.exists) {
        let usernameStore = friendStoreSnap.data().usernames;

        if (usernameStore.hasOwnProperty(inputEl.value)) {
          if (usernameStore[inputEl.value] !== props.user.uid) {
            addOutgoingFriendToSelf(props.user, usernameStore, () => {
              addIncomingFriendToOther(
                props.user,
                inputEl.value,
                usernameStore,
                () => {
                  props.setSnackbarText(`Sent Friend Request.`);
                  props.setSnackbarOpen(true);
                }
              );
            });
          } else {
            props.setSnackbarText(`You can not add yourself.`);
            props.setSnackbarOpen(true);
          }
        } else {
          props.setSnackbarText(`No user with that name exists.`);
          props.setSnackbarOpen(true);
        }
      }
    });
    setAddFriendOpen(false);
  };
  const declineSelectedRequests = () => {
    const declineFriendRequestSelf = (otherId, callback) => {
      getUser(props.user.uid, (selfSnap) => {
        if (selfSnap.exists) {
          let oldIncoming = selfSnap.data().incomingFriendRequests;
          const index = oldIncoming.indexOf(otherId);
          if (index > -1) {
            oldIncoming.splice(index, 1);
          }

          updateFieldToUser(
            props.user.uid,
            "incomingFriendRequests",
            oldIncoming,
            callback
          );
        }
      });
    };
    const declineFriendRequestOther = (otherId) => {
      getUser(otherId, (otherSnap) => {
        if (otherSnap.exists) {
          let oldOutgoing = otherSnap.data().outgoingFriendRequests;
          const index = oldOutgoing.indexOf(props.user.uid);
          if (index > -1) {
            oldOutgoing.splice(index, 1);
          }

          updateFieldToUser(
            otherId,
            "outgoingFriendRequests",
            oldOutgoing,
            () => {}
          );
        }
      });
    };

    selectedRequests.forEach((otherId) => {
      declineFriendRequestSelf(otherId, () => {
        declineFriendRequestOther(otherId);
      });
    });
    if (selectedRequests.length > 0) {
      setSelectedRequests([]);
      props.setSnackbarText(`Declined selected requests.`);
      props.setSnackbarOpen(true);
      setAcceptFriendsOpen(false);
    } else {
      props.setSnackbarText(`No requests selected.`);
      props.setSnackbarOpen(true);
    }
  };
  const acceptSelectedRequests = (event) => {
    const acceptFriendRequest = (userId, otherId, callback) => {
      getUser(userId, (selfSnap) => {
        if (selfSnap.exists && !selfSnap.data().friends.includes(otherId)) {
          let tempFriends = selfSnap.data().friends;

          tempFriends.push(otherId);

          updateFieldToUser(userId, "friends", tempFriends, () => {
            callback();
          });
        } else if (
          selfSnap.exists &&
          selfSnap.data().friends.includes(otherId)
        ) {
          props.setSnackbarText(`You are already friends.`);
          props.setSnackbarOpen(true);
        }
      });
    };
    selectedRequests.forEach((otherId) => {
      acceptFriendRequest(props.user.uid, otherId, () => {
        acceptFriendRequest(otherId, props.user.uid, () => {
          getUser(props.user.uid, (selfSnap) => {
            let myTempIncoming = selfSnap.data().incomingFriendRequests;

            const indexA = myTempIncoming.indexOf(otherId);
            if (indexA > -1) {
              myTempIncoming.splice(indexA, 1);
            }

            updateFieldToUser(
              props.user.uid,
              "incomingFriendRequests",
              myTempIncoming,
              () => {
                getUser(otherId, (otherSnap) => {
                  let myTempOutgoing = otherSnap.data().outgoingFriendRequests;

                  const indexB = myTempOutgoing.indexOf(props.user.uid);
                  if (indexB > -1) {
                    myTempOutgoing.splice(indexB, 1);
                  }

                  updateFieldToUser(
                    otherId,
                    "outgoingFriendRequests",
                    myTempOutgoing,
                    () => {
                      let newSelected = [];

                      selectedRequests.forEach((request) => {
                        if (request !== otherId) {
                          newSelected.push(otherId);
                        }
                      });

                      setSelectedRequests(newSelected);
                    }
                  );
                });
              }
            );
          });
        });
      });
    });
    if (selectedRequests.length > 0) {
      setSelectedRequests([]);
      props.setSnackbarText(`Accepted selected requests.`);
      props.setSnackbarOpen(true);
      setAcceptFriendsOpen(false);
    } else {
      props.setSnackbarText(`No requests selected.`);
      props.setSnackbarOpen(true);
    }
  };

  React.useEffect(() => {
    props.database
      .collection("users")
      .doc(props.user.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          if (snapshot.data().hasOwnProperty("incomingFriendRequests")) {
            setPendingRequests(snapshot.data().incomingFriendRequests);
          }
        }
      });
  }, []);

  return (
    <div className="FriendsListTab">
      <Dialog open={areYouSureOpen} onClose={closeAreYouSure}>
        <DialogTitle>Remove Selected Friends</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clicking the remove button will remove the friends listed below.
          </DialogContentText>
          <List className="FriendsListTab-List">
            {selectedRequests.map((friendId, id) => (
              <FriendInList
                checkbox={false}
                friendId={friendId}
                setSelectedRequests={setSelectedRequests}
                selectedRequests={selectedRequests}
                {...props}
                key={id}
              />
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAreYouSure} color="primary">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={removeSelected}
          >
            Remove Selected
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={acceptFriendsOpen} onClose={closeAcceptFriends}>
        <DialogTitle>Pending Friend Requests</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Use this area to accept or decline friend requests.
          </DialogContentText>
          <List className="FriendsListTab-List">
            {pendingRequests.map((friendId, id) => (
              <FriendInList
                checkbox={true}
                friendId={friendId}
                setSelectedRequests={setSelectedRequests}
                selectedRequests={selectedRequests}
                {...props}
                key={id}
              />
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeAcceptFriends} color="primary">
            Cancel
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={acceptSelectedRequests}
          >
            Accept Selected
          </Button>
          <Button
            color="secondary"
            variant="contained"
            onClick={declineSelectedRequests}
          >
            Decline Selected
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={addFriendOpen} onClose={closeAddFriend}>
        <DialogTitle>Add Friend</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To add a new friend, please input their username.
          </DialogContentText>
          <form noValidate autoComplete="off" onSubmit={addFriend}>
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
          <Button onClick={closeAddFriend} color="primary">
            Cancel
          </Button>
          <Button onClick={addFriend} color="secondary" variant="contained">
            Add Friend
          </Button>
        </DialogActions>
      </Dialog>
      <Paper className="FriendsListTab-ListPaper" variant="outlined">
        <List
          className="FriendsListTab-List"
          subheader={<ListSubheader component="div">{`Friends`}</ListSubheader>}
        >
          <Divider />
          {props.friends.map((friendId, id) => (
            <FriendInList
              checkbox={true}
              friendId={friendId}
              setSelectedRequests={setSelectedRequests}
              selectedRequests={selectedRequests}
              {...props}
              key={id}
            />
          ))}
        </List>
      </Paper>
      <div className="FriendsListTab-RightBar">
        <Paper className="FriendsListTab-Sorting" variant="outlined">
          <List
            className="FriendsListTab-List"
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
        <Paper className="FriendsListTab-Actions" variant="outlined">
          <List
            className="FriendsListTab-List"
            subheader={
              <ListSubheader component="div">Friend Actions</ListSubheader>
            }
          >
            <Divider />
            {pendingRequests.length > 0 && (
              <ListItem button onClick={openAcceptFriends}>
                <ListItemIcon>
                  <Badge
                    badgeContent={pendingRequests.length}
                    color="secondary"
                  >
                    <FilterListIcon />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Incoming Requests" />
              </ListItem>
            )}
            {pendingRequests.length > 0 && <Divider variant="inset" />}
            <ListItem button onClick={openAddFriend}>
              <ListItemIcon>
                <PersonAddIcon />
              </ListItemIcon>
              <ListItemText primary="Add Friend" />
            </ListItem>
            <Divider variant="inset" />
            <ListItem button onClick={openAreYouSure}>
              <ListItemIcon>
                <DeleteForeverIcon />
              </ListItemIcon>
              <ListItemText primary="Remove Selected" />
            </ListItem>
          </List>
        </Paper>
      </div>
    </div>
  );
}

export default FriendListTab;
