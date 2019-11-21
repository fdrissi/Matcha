import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { CssBaseline, Container } from "@material-ui/core";
import NotificationsIcon from "@material-ui/icons/Notifications";

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
  }
}));

export const NotificationsList = () => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src="/img/profile.png" />
        </ListItemAvatar>
        <ListItemText
          primary="Brunch this weekend?"
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                Ali Connors
              </Typography>
              {" — I'll be in your neighborhood doing errands this…"}
            </React.Fragment>
          }
        />
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

export const Title = ({ text, classes, color = "black" }) => {
  return (
    <>
      <h3
        className={classes}
        style={{
          color: color
        }}
      >
        {text}
      </h3>
    </>
  );
};

const NotificationsHoler = () => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Icon />
      <Title text={"Notifications"} classes={classes} />
      <NotificationsList />
      <NotificationsList />
      <NotificationsList />
      <NotificationsList />
      <NotificationsList />
    </Container>
  );
};

export const Notifications = () => {
  return (
    <div>
      <NotificationsHoler />
    </div>
  );
};
