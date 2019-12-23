import axios from "axios";
import {
  LOAD_MATCHED,
  MATCHED_FAIL,
  LOAD_CONVERSATION,
  CONVERSATION_FAIL,
  MESSAGE_SEEN,
  MESSAGE_UNSEEN,
  CHAT_SEEN,
  CHAT_UNSEEN
} from "./actionTypes";

export const getMatched = async dispatch => {
  try {
    const res = await axios.get("/api/chat/");
    if (res.data.success) {
      dispatch({
        type: LOAD_MATCHED,
        payload: res.data.conversations
      });
    } else {
      dispatch({
        type: MATCHED_FAIL
      });
    }
  } catch (error) {
    dispatch({
      type: MATCHED_FAIL
    });
  }
};

export const getUserChat = async (pid, dispatch) => {
  if (!pid) return false;
  try {
    const res = await axios.get(`/api/chat/conversation/${pid}`);
    if (res.data.success) {
      unseenCountConversation(pid, dispatch);
      dispatch({
        type: LOAD_CONVERSATION,
        payload: res.data.conversations
      });
    } else {
      dispatch({
        type: CONVERSATION_FAIL
      });
    }
  } catch (error) {
    dispatch({
      type: CONVERSATION_FAIL
    });
  }
};

export const sendMessage = async (
  sender,
  receiver,
  message,
  dispatch,
  socket
) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "/api/chat/sendMessage",
      { sender, receiver, message },
      config
    );
    if (res.data.success) {
      getUserChat(receiver, dispatch);
      socket.emit("newMessage", {
        id: Date.now(),
        sender,
        receiver,
        message
      });
    }
  } catch (error) {}
};

export const updateSeen = async (uid, pid, dispatch, socket) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.put("/api/chat/setSeen", { pid }, config);
    if (res.data.success) {
      unseenCountGlobal(uid, dispatch, socket);
      dispatch({
        type: MESSAGE_SEEN
      });
    }
  } catch (error) {}
};

export const unseenCountGlobal = async (uid, dispatch, socket) => {
  try {
    const res = await axios.get("/api/chat/unseenCount/");
    if (res.data.success) {
      //if (res.data.count == 0) socket.emit("clearNotifications", { id: uid });
      dispatch({
        type: CHAT_UNSEEN,
        payload: res.data.count
      });
    }
  } catch (error) {
    dispatch({
      type: CHAT_SEEN
    });
  }
};

export const unseenCountConversation = async (pid, dispatch) => {
  try {
    const res = await axios.get(`/api/chat/unseen/${pid}`);
    if (res.data.success) {
      dispatch({
        type: MESSAGE_UNSEEN,
        payload: res.data.count
      });
    }
    return res.data.count;
  } catch (error) {
    dispatch({
      type: MESSAGE_SEEN
    });
    return false;
  }
};
