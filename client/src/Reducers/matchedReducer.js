import { LOAD_MATCHED, MATCHED_FAIL } from "../actions/actionTypes";

export const matchedInitState = {
  loading: true,
  matched: []
};

export const matchedReducer = (state = matchedInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOAD_MATCHED:
      return {
        ...state,
        loading: false,
        matched: payload
      };
    case MATCHED_FAIL:
      return {
        ...state,
        loading: false,
        matched: []
      };

    default:
      return state;
  }
};
