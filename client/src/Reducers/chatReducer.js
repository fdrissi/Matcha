import { LOAD_MATCHED, MATCHED_FAIL } from "../actions/actionTypes";

export const matchedInitState = {
  loading: true,
  unseenGlobal: 0,
  unseenConversation: false,
  conversation: []
};

export const matchedReducer = (state = matchedInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_MATCHED:
      return {
        ...state,
        loading: false,
        conversation: payload
      };
    case MATCHED_FAIL:
      return {
        ...state,
        loading: false,
        conversation: []
      };

    default:
      return state;
  }
};
