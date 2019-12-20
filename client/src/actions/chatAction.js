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
      "sendMessage",
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

export const updateSeen = async (sender, receiver, message, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };
  try {
    const res = await axios.post(
      "sendMessage",
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
