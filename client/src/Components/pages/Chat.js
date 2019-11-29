import React, { useState } from "react";
import { NotificationsList as UserChat } from "./Notifications";
import { Container, Grid, Box, TextField, Button } from "@material-ui/core";

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
