import axios from "axios";
import {
  LOAD_MATCHED,
  MATCHED_FAIL,
  LOAD_CONVERSATION,
  CONVERSATION_FAIL
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
  try {
    const res = await axios.get(`/conversation/${pid}`);
    if (res.data.success) {
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

export const sendMessage = async (sender, receiver, message, dispatch) => {
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
      getUserChat(receiver);
    }
  } catch (error) {
    dispatch({
      type: CONVERSATION_FAIL
    });
  }
};

// what to do after ?
export const updateSeen = async (pid, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.put("/api/chat/setSeen", { pid }, config);
    if (res.data.success) {
      dispatch({
        type: MESSAGE_SEEN,
        payload: 0
      });
    }
  } catch (error) {
    dispatch({
      type: MESSAGE_UNSEEN
    });
  }
};

export const unseenCountGlobal = async (pid, dispatch) => {
  try {
    const res = await axios.get("/api/chat/unseenCount/", { pid }, config);
    if (res.data.success) {
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
        type: MESSAGE_SEEN,
        payload: res.data.count
      });
    }
  } catch (error) {
    dispatch({
      type: MESSAGE_UNSEEN
    });
  }
};
