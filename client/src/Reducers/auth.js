import { LOGIN_SUCCESS, LOGIN_FAIL } from "../actions/types";

export const authInitState = {
  user: {
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    loading: true,
    user: null
  }
};

export const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("token", payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };
    case LOGIN_FAIL:
      localStorage.removeItem("token");
      return { ...state, toekn: null, isAuthenticated: false, loading: false };

    default:
      return state;
  }
};
