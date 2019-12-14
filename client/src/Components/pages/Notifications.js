import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useUserStore } from "../../Context/appStore";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { CssBaseline, Container, Fab, Grid } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    maxWidth: 500,
    backgroundColor: "transparent"
  },
  title: {
    fontSize: "30px",
    fontWeight: "bolder",
    letterSpacing: "2px",
    textAlign: "center"
  },
  item: {
    "&:hover": {
      backgroundColor: "#F2F8FD"
    }
  },
  inline: {
    display: "inline"
  },
  avatar: {
    backgroundColor: "#e74c3c",
    width: "100px",
    height: "100px",
    margin: "5% auto 0"
  },
  btn: {
    display: "inline-block",
    margin: "0% 1%",
    fontSize: "16px",
    fontWeight: "bold",
    border: "1px solid #e74c3c",
    textTransform: "capitalize",
    backgroundColor: "#e74c3c",
    "&:hover": {
      backgroundColor: "transparent",
      color: "#e74c3c",
      border: "1px solid #e74c3c"
    }
  }
}));

export const NotificationsList = ({ userNotification }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem
        alignItems="flex-start"
        className={classes.item}
        style={{ backgroundColor: !userNotification.seen && "#F2F8FD" }}
      >
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={`/uploads/${userNotification.profile_image}`}
          />
        </ListItemAvatar>
        <Link to={`profile/${userNotification.id_profile}`}>
          <ListItemText
            primary={`${userNotification.first_name} ${userNotification.last_name}`}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {`At ${userNotification.date}`}
                </Typography>
                {` - ${userNotification.notification} you`}
              </React.Fragment>
            }
          />
        </Link>
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};

const Icon = () => {
  const classes = useStyles();
  return (
    <Avatar className={classes.avatar}>
      <NotificationsIcon style={{ fontSize: "80px" }} />
    </Avatar>
  );
};

const ButtonRed = ({ icon = false }) => {
  const classes = useStyles();
  return (
    <Fab
      variant="extended"
      color="primary"
      aria-label="add"
      className={classes.btn}
    >
      <div style={{ width: "100%" }}>
        <span style={{ verticalAlign: "center", fontSize: "28px" }}>
          {icon}
        </span>
      </div>
    </Fab>
  );
};

export const Title = ({ text, classes, color = "black", setNotifications }) => {
  const handleClick = async () => {
    await axios.get("/api/profile/clearUserNotifications");
    setNotifications([]);
  };
  return (
    <Grid container>
      <Grid item xs={10}>
        <h3
          className={classes}
          style={{
            color: color
          }}
        >
          {text}
        </h3>
      </Grid>
      <Grid item xs={2} onClick={handleClick}>
        <ButtonRed icon={<DeleteIcon />} />
      </Grid>
    </Grid>
  );
};

const NotificationsHoler = ({ notifications, setNotifications }) => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Icon />
      <Title
        text={"Notifications"}
        classes={classes}
        setNotifications={setNotifications}
      />
      {notifications.length === 0 ? (
        <p style={{ color: "grey", fontSize: "12px" }}>Notifications empty</p>
      ) : (
        notifications.map(notif => (
          <NotificationsList key={notif.id} userNotification={notif} />
        ))
      )}
    </Container>
  );
};

export const Notifications = () => {
  const [load, setLoad] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [{ auth }] = useUserStore();

  useEffect(() => {
    (async () => {
      let result = await axios.get("/api/profile/getUserNotifications");
      if (result.data.success) {
        setNotifications(result.data.notifications);
        setLoad(true);
        result = await axios.get("/api/profile/updateNotifications");
        if (result.data.success)
          socket.emit("clearNotifications", { id: auth.userInfo.id });
      }
    })();
  }, [auth.userInfo.id]);

  if (!load) return null;
  return (
    <div>
      <NotificationsHoler
        notifications={notifications}
        setNotifications={setNotifications}
      />
    </div>
  );
};
