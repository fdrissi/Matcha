import { SET_ALERT, REMOVE_ALERT } from "../actions/actionTypes";

export const alertInitState = {
  alertType: "",
  msg: ""
};

export const alertReducer = (state = alertInitState, action) => {
  const { type, payload } = action;
  console.log("type", type);
  console.log("payload", payload);
  switch (type) {
    case SET_ALERT:
      return { ...state, alertType: payload.alertType, msg: payload.msg };
    case REMOVE_ALERT:
      return { ...state, alertType: null, msg: "" };

    default:
      return state;
  }
};
