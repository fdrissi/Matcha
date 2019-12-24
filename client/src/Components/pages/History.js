import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { CssBaseline, Container, Fab, Grid } from "@material-ui/core";
import HistoryIcon from "@material-ui/icons/History";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { useUserStore } from "../../Context/appStore";

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

export const HistoryList = ({ userHistory }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar
            alt="Remy Sharp"
            src={`/uploads/${userHistory.profile_image}`}
          />
        </ListItemAvatar>
        <Link to={`profile/${userHistory.id_profile}`}>
          <ListItemText
            primary={`${userHistory.first_name} ${userHistory.last_name}`}
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  {userHistory.date}
                </Typography>
                {" - On this date you visited this profile"}
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
      <HistoryIcon style={{ fontSize: "80px" }} />
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

export const Title = ({ text, classes, color = "black", setHistory }) => {
  const handleClick = async () => {
    await axios.get("/api/profile/clearUserHistory");
    setHistory([]);
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

const HistoryHolder = ({ history, setHistory }) => {
  const classes = useStyles();
  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Icon />
      <Title text={"History"} classes={classes} setHistory={setHistory} />
      {history.map(his => (
        <HistoryList userHistory={his} key={his.id} />
      ))}
    </Container>
  );
};

export const History = () => {
  const [{ profile }] = useUserStore();
  const [load, setLoad] = useState(false);
  const [history, setHistory] = useState([]);
  useEffect(() => {
    (async () => {
      if (profile.Verification.isVrified) {
        const result = await axios.get("/api/profile/getUserHistory");
        if (result.data.success) {
          setHistory(result.data.history);
          setLoad(true);
        }
      }
    })();
  }, [profile.Verification.isVrified]);
  if (!load) return null;
  return (
    <div>
      <HistoryHolder history={history} setHistory={setHistory} />
    </div>
  );
};
