import React, { useState, useEffect } from "react";
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
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography
} from "@material-ui/core";
import axios from "axios";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CircularProgress from "@material-ui/core/CircularProgress";

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

const LoadChat = ({ chat }) => {
  const [{ auth }] = useUserStore();
  return (
    <div style={{ height: "70vh", overflowY: "scroll" }}>
      {chat.length === 0
        ? "Conversation Empty"
        : chat.map(msg => (
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
    </div>
  );
};

const SubmitBox = ({ selected }) => {
  const [{ auth }] = useUserStore();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(true);
  const profileId =
    auth.userInfo.id === selected.id_user
      ? selected.id_profile
      : selected.id_user;

  useEffect(() => {
    if (auth.isAuthenticated) {
      (async () => {
        const result = await axios.get(
          `api/chat/${auth.userInfo.id}/conversation/${profileId}`
        );
        if (result.data.success) {
          setChat(result.data.conversations);
        }
        setLoading(false);
      })();
    }
  }, [auth.isAuthenticated, profileId, auth.userInfo.id]);
  const handleChange = e => setMessage(e.target.value);
  const handleSubmit = form => {
    form.preventDefault();
    (async () => {
      let config = {
        header: {
          "Content-Type": "application/json"
        }
      };
      const result = await axios.post(
        `api/chat/sendMessage`,
        {
          sender: auth.userInfo.id,
          receiver: profileId,
          message
        },
        config
      );
      if (result.data.success) {
        let oldChat = chat;
        oldChat.push({
          id: Date.now(),
          sender: auth.userInfo.id,
          receiver: profileId,
          message
        });
        setChat(oldChat);
        setMessage("");
      }
    })();
  };
  if (loading) return null;
  return (
    <>
      <UserInfo info={selected} />
      <LoadChat chat={chat} />
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
                {`Click to Chat`}
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
  const [{ auth }] = useUserStore();

  const [matched, setMatched] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(0);
  useEffect(() => {
    if (auth.isAuthenticated) {
      (async () => {
        const result = await axios.get(`api/chat/${auth.userInfo.id}`);
        if (result.data.success) {
          setMatched(result.data.conversations);

          setSelected(result.data.conversations[0]);
        }
        setLoading(false);
      })();
    }
  }, [auth.isAuthenticated, auth.userInfo.id]);

  if (loading) return null;
  if (matched.length === 0)
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
                There is no user that matched with you yet 😥
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
        <ListChats matched={matched} select={setSelected} />
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
