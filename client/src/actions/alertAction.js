import { SET_ALERT, REMOVE_ALERT } from "./actionTypes";

export const setAlert = (msg, alertType, dispatch) => {
  const payload = {
    msg,
    alertType
  };
  dispatch({ type: SET_ALERT, payload });
};
