import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR
} from "../actions/actionTypes";

export const authInitState = {
  isAuthenticated: false,
  loading: true,
  userInfo: {
    email: "",
    first_name: "",
    id: "",
    last_name: "",
    recovery_key: "",
    username: "",
    verification_key: "",
    verified: ""
  }
};

export const authReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        userInfo: payload
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        loading: false
      };
    case LOGIN_FAIL:
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: true,
        userInfo: {
          email: "",
          first_name: "",
          id: "",
          last_name: "",
          recovery_key: "",
          username: "",
          verification_key: "",
          verified: ""
        }
      };

    default:
      return state;
  }
};
