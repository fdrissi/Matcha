import React, { useState } from "react";
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

const useStyles = makeStyles(() => ({
  item: {
    "&:hover": {
      backgroundColor: "#F2F8FD"
    }
  },
  inline: {
    display: "inline"
  }
}));

const UserInfo = () => {
  return <div>userInfo</div>;
};

const LoadChat = () => {
  return <div style={{ height: "70vh" }}>Messages</div>;
};

const SubmitBox = () => {
  const [message, setMessage] = useState("");
  const onChange = e => setMessage(e.target.value);
  //const onSubmit = form => {};
  return (
    <form>
      <Box display="flex" flexWrap="wrap" alignItems="center">
        <Box flexGrow={1}>
          <TextField
            helperText="Type Message"
            variant="standard"
            margin="normal"
            fullWidth
            id="message"
            label="Message"
            name="message"
            value={message}
            onChange={e => onChange(e)}
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
  );
};

const Conversation = () => {
  return (
    <Grid container>
      <Grid item xs={12}>
        <UserInfo />
        <LoadChat />
        <SubmitBox />
      </Grid>
    </Grid>
  );
};

export const UserChat = () => {
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start" className={classes.item}>
        <ListItemAvatar>
          <Avatar alt="Remy Sharp" src={`/uploads/1/profile.jpg`} />
        </ListItemAvatar>
        <ListItemText
          primary={`Full Name`}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary"
              >
                {`At date`}
              </Typography>
              {` - message you`}
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </List>
  );
};

const ListChats = () => {
  return (
    <Grid container style={{ height: "80vh", overflowY: "scroll" }}>
      <Grid item xs={12}>
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
        <UserChat />
      </Grid>
    </Grid>
  );
};

const ChatHolder = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <ListChats />
      </Grid>
      <Grid item xs={8}>
        <Conversation />
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
