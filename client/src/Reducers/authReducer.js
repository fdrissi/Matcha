import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/actionTypes";
import axios from "axios";

const loadUser = async () => {
  const config = {
    headers: {
      "x-auth-token": localStorage.getItem("token")
    }
  };
  const res = await axios.get("/api/users/current", config);
  return res.data.user;
};

export const authInitState = {
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  loading: true,
  userInfo:
    typeof localStorage.getItem("token") === "undifined" ? {} : loadUser()
};

export const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        userInfo: payload.user
      };
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return { ...state, toekn: null, isAuthenticated: false, loading: false };

    default:
      return state;
  }
};
