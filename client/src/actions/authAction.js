import axios from "axios";
import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  SET_ALERT,
  REMOVE_ALERT,
  FAILIED_REGISTRATION,
  SUCCESS_REGISTRATION
} from "./actionTypes";

export const login = async (email, password, remember, dispatch) => {
  let config = {
    header: {
      "Content-Type": "application/json"
    }
  };

  try {
    let res = await axios.post(
      "/api/users/login",
      { email, password, remember },
      config
    );
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
      res = await axios.get("/api/users/current");
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data.user
      });
    }
  } catch (error) {
    dispatch({
      type: LOGIN_FAIL
    });
  }
};

export const register = async (mydata, dispatch) => {
  const config = {
    header: {
      "Content-Type": "application/json"
    }
  };

  try {
    const res = await axios.post("/api/users/register", mydata, config);
    if (!res.data.success) {
      dispatch({
        type: FAILIED_REGISTRATION,
        payload: {
          message: "Register unsuccess",
          errors: res.data.errors
        }
      });
    } else {
      dispatch({
        type: SUCCESS_REGISTRATION,
        payload: {
          message: "Register success"
        }
      });
    }
  } catch (error) {
    dispatch({
      type: FAILIED_REGISTRATION,
      payload: {
        message: "Register unsuccess",
        errors: {}
      }
    });
  }
};
export const loadUser = async dispatch => {
  try {
    const res = await axios.get("/api/users/current");
    if (res.data.success) {
      const payload = res.data.user;
      dispatch({
        type: USER_LOADED,
        payload
      });
    } else {
      dispatch({
        type: AUTH_ERROR
      });
    }
  } catch (error) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

export const updateUser = async data => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      oldPassword,
      newPassword
    } = data;
  } catch (error) {}
};
