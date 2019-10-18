import axios from "axios";
import { LOGIN_SUCCESS, LOGIN_FAIL, SET_ALERT } from "../actions/types";

export const login = async (email, password, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post(
      "/api/users/login",
      { email, password },
      config
    );
    if (!res.data.success)
      dispatch({
        type: SET_ALERT,
        payload: {
          type: "danger",
          msg: res.data.errorMsg
        }
      });
    else {
      console.log("logged in success");
    }
    // dispatch({
    //   type: LOGIN_SUCCESS,
    //   payload: res.data
    // });
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};
