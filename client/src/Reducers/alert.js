import { SET_ALERT, REMOVE_ALERT } from "../actions/types";

export const alertInitState = [];

export const alertReducer = (state = alertInitState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      return { ...state, payload };
    case REMOVE_ALERT:
      return { ...state, payload: { type: null, msg: "" } };

    default:
      return state;
  }
};
