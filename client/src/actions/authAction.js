import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SET_ALERT,
  REMOVE_ALERT
} from "./actionTypes";

export const login = async (email, password, dispatch) => {
  let config = {
    header: {
      "Content-Type": "application/json"
    }
  };

  try {
    let res = await axios.post("/api/users/login", { email, password }, config);
    if (!res.data.success) {
      dispatch({
        type: SET_ALERT,
        payload: {
          type: "danger",
          msg: res.data.errorMsg
        }
      });
      setTimeout(() => {
        dispatch({
          type: REMOVE_ALERT
        });
      }, 5000);
    } else {
      const token = res.data.token;
      config = {
        headers: {
          "x-auth-token": token
        }
      };
      res = await axios.get("/api/users/current", config);
      dispatch({
        type: LOGIN_SUCCESS,
        payload: {
          token,
          user: res.data.user
        }
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
