import {
  MESSAGE_SEEN,
  MESSAGE_UNSEEN,
  LOAD_CONVERSATION,
  CONVERSATION_FAIL,
  CHAT_UNSEEN,
  CHAT_SEEN
} from "../actions/actionTypes";

export const chatInitState = {
  loading: true,
  unseenGlobal: 0,
  unseenConversation: false,
  conversation: []
};

export const chatReducer = (state = chatInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_CONVERSATION:
      return {
        ...state,
        loading: false,
        conversation: payload
      };
    case CONVERSATION_FAIL:
      return {
        ...state,
        loading: false,
        conversation: []
      };
    case MESSAGE_SEEN:
      return {
        ...state,
        loading: false,
        unseenConversation: false
      };
    case MESSAGE_UNSEEN:
      return {
        ...state,
        loading: false,
        unseenConversation: payload ? true : false
      };
    case CHAT_UNSEEN:
      return {
        ...state,
        loading: false,
        unseenGlobal: payload
      };
    case CHAT_SEEN:
      return {
        ...state,
        loading: false,
        unseenGlobal: 0
      };

    default:
      return state;
  }
};
