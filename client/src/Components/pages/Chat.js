import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useUserStore } from "../../Context/appStore";
import {
  makeStyles,
  Container,
  Grid,
  Box,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useSocketStore } from "../../Context/appStore";
import {
  getMatched,
  getUserChat,
  sendMessage,
  updateSeen
} from "../../actions/chatAction";

const useStyles = makeStyles(() => ({
  item: {
    "&:hover": {
      backgroundColor: "#F2F8FD"
    }
  },
  inline: {
    display: "inline"
  },
  border: {
    border: "2px solid #e0e0e0",
    borderRadius: "5px",
    padding: "5px 1px",
    marginBottom: "1%"
  }
}));

const UserInfo = ({ info }) => {
  const [{ auth }] = useUserStore();

  const classes = useStyles();
  const profileId =
    auth.userInfo.id === info.id_user ? info.id_profile : info.id_user;

  if (auth.loading) return null;
  return (
    <div className={classes.border}>
      <Link
        to={`/profile/${profileId}`}
        style={{ textDecoration: "none", color: "#e74c3c" }}
      >
        <h4>{`${info.first_name} ${info.last_name}`}</h4>
      </Link>
    </div>
  );
};

const LoadChat = ({ chat, pid }) => {
  const [{ auth }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const messagesEndRef = React.createRef();

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    if (chat.unseenConversation) {
      updateSeen(auth.userInfo.id, pid, stableDispatch);
    }
  }, [
    messagesEndRef,
    chat.unseenConversation,
    auth.userInfo.id,
    pid,
    stableDispatch
  ]);

  return (
    <div>
      <div style={{ height: "70vh", overflowY: "scroll" }}>
        {chat.conversation.length === 0
          ? "Conversation Empty"
          : chat.conversation.map(msg => (
              <li
                key={msg.id}
                style={{
                  listStyle: "none",
                  fontWeight: "600",
                  color: "#FFF",
                  borderRadius: "5px",
                  marginBottom: "5px"
                }}
              >
                <span
                  style={{
                    padding: "2px 5px",
                    borderRadius: "5px",
                    backgroundColor:
                      +msg.sender !== +auth.userInfo.id ? "#e74c3c" : "#3f51b5"
                  }}
                >{`${msg.message}`}</span>
              </li>
            ))}
        <div ref={messagesEndRef}></div>
      </div>
    </div>
  );
};

const SubmitBox = ({ selected }) => {
  const [{ auth, chat }, dispatch] = useUserStore();
  const socket = useSocketStore();
  const [message, setMessage] = useState("");
  const profileId =
    auth.userInfo.id === selected.id_user
      ? selected.id_profile
      : selected.id_user;

  const handleChange = e => setMessage(e.target.value);

  const handleSubmit = form => {
    form.preventDefault();
    if (message) {
      sendMessage(auth.userInfo.id, profileId, message, dispatch, socket);
      setMessage("");
    }
  };

  if (!selected) return null;
  return (
    <>
      <UserInfo info={selected} />
      <LoadChat chat={chat} pid={profileId} />
      <form onSubmit={form => handleSubmit(form)}>
        <Box display="flex" flexWrap="wrap" alignItems="center">
          <Box flexGrow={1}>
            <TextField
              helperText="Type Message"
              variant="standard"
              margin="normal"
              fullWidth
              multiline={true}
              id="message"
              label="Message"
              name="message"
              value={message}
              onChange={e => handleChange(e)}
              autoFocus
            />
          </Box>
          <Box>
            <Button type="submit" fullWidth variant="contained" color="primary">
              Send
            </Button>
          </Box>
        </Box>
      </form>
    </>
  );
};

const Conversation = ({ selected }) => {
  const [{ auth }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const socket = useSocketStore();
  const profileId =
    auth.userInfo.id === selected.id_user
      ? selected.id_profile
      : selected.id_user;
  localStorage.setItem("pid", profileId);
  useEffect(() => {
    getUserChat(profileId, stableDispatch);
  }, [profileId, stableDispatch]);

  if (socket.listeners("newMessage").length < 1) {
    socket.on("newMessage", data => {
      if (+data.sender === +localStorage.getItem("pid"))
        getUserChat(localStorage.getItem("pid"), dispatch);
    });
  }

  return (
    <Grid container>
      <Grid item xs={12}>
        <SubmitBox selected={selected} />
      </Grid>
    </Grid>
  );
};

export const UserChat = ({ info, select }) => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem
        alignItems="flex-start"
        className={classes.item}
        onClick={() => select(info)}
      >
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={`/uploads/${info.profile_Image}`} />
        </ListItemAvatar>

        <ListItemText
          primary={`${info.first_name} ${info.last_name}`}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                Click to Chat
                <span style={{ color: "#BA0000", fontSize: "8px" }}> </span>
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
    </List>
  );
};

const ListChats = ({ matched, select }) => {
  return (
    <Grid container style={{ height: "80vh", overflowY: "scroll" }}>
      <Grid item xs={12}>
        {matched.map(mat => (
          <UserChat key={mat.id} info={mat} select={select} />
        ))}
      </Grid>
    </Grid>
  );
};

const ChatHolder = () => {
  const [{ matches }, dispatch] = useUserStore();
  const stableDispatch = useCallback(dispatch, []);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    getMatched(stableDispatch);
  }, [stableDispatch]);

  if (matches.matched.length === 0 || matches.loading)
    return (
      <Card style={{ backgroundColor: "transparent" }}>
        <CardContent>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid xs={12} container item justify="center">
              <Typography variant="subtitle1" gutterBottom>
                <img
                  src="./img/widget-title-border.png"
                  alt="left"
                  style={{ color: "rgb(231, 76, 60)" }}
                />
                {" Chat "}
                <img
                  src="./img/widget-title-border.png"
                  alt="left"
                  style={{ color: "rgb(231, 76, 60)", transform: "scaleX(-1)" }}
                />
              </Typography>
            </Grid>
            <Grid xs={12} container item justify="center">
              <Typography variant="overline" id="range-slider" gutterBottom>
                There is no user that matched with you yet
              </Typography>
            </Grid>
            <Grid xs={12} container item justify="center">
              <CircularProgress disableShrink style={{ color: "#e74c3c" }} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ListChats matched={matches.matched} select={setSelected} />
      </Grid>
      <Grid item xs={8}>
        <Conversation selected={selected} />
      </Grid>
    </Grid>
  );
};

const Chat = () => {
  return (
    <Container>
      <ChatHolder />
    </Container>
  );
};

export default Chat;
