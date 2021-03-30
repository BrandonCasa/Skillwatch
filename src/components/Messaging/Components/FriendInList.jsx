import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
// Material UI
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Chip from "@material-ui/core/Chip";
import FaceIcon from "@material-ui/icons/Face";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
// SCSS
import "./FriendInList.scss";

function FriendInList(props) {
  const [status, setStatus] = React.useState("Error");
  const [username, setUsername] = React.useState("Error");
  const [bio, setBio] = React.useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
  );
  const [friendExists, setFriendExists] = React.useState(false);
  const [selected, setSelected] = React.useState(false);

  React.useEffect(() => {
    setSelected(props.selectedRequests.includes(props.friendId));
    props.database
      .collection("users")
      .doc(props.friendId)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setFriendExists(true);

          if (snapshot.data().hasOwnProperty("status"))
            setStatus(snapshot.data().status);
          if (snapshot.data().hasOwnProperty("username"))
            setUsername(snapshot.data().username);
          if (snapshot.data().hasOwnProperty("bio"))
            setBio(snapshot.data().bio);
        }
      });
  }, []);

  if (friendExists) {
    return (
      <ListItem className={"FriendInList-ListItem"}>
        <Accordion className={`FriendInList-Accordion${status}`}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>{`${username} (${status})`}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <Typography variant="h6">Bio:</Typography>
              <Typography variant="subtitle1">{bio}</Typography>
              <Typography variant="h6">Info:</Typography>
              <div>
                <Chip
                  icon={<FaceIcon />}
                  label="Brandon"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<FaceIcon />}
                  label="Male"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<FaceIcon />}
                  label="Overwatch"
                  style={{ marginRight: "8px" }}
                />
                <Chip
                  icon={<FaceIcon />}
                  label="Warframe"
                  style={{ marginRight: "8px" }}
                />
              </div>
              <Typography variant="h6">Select Request:</Typography>
              <Checkbox
                checked={selected}
                onChange={(event) => {
                  let oldSelected = props.selectedRequests;
                  setSelected(event.target.checked);

                  if (
                    event.target.checked &&
                    !oldSelected.includes(props.friendId)
                  ) {
                    oldSelected.push(props.friendId);
                    props.setSelectedRequests(oldSelected);
                  } else if (
                    !event.target.checked &&
                    oldSelected.includes(props.friendId)
                  ) {
                    const index = oldSelected.indexOf(props.friendId);
                    if (index > -1) {
                      oldSelected.splice(index, 1);
                    }
                    props.setSelectedRequests(oldSelected);
                  }
                }}
                className="FriendInList-Checkbox"
                color="primary"
              />
            </div>
          </AccordionDetails>
        </Accordion>
      </ListItem>
    );
  } else {
    return <React.Fragment />;
  }
}

export default FriendInList;
