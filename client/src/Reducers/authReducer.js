import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  SUCCESS_REGISTRATION,
  FAILIED_REGISTRATION,
  REMOVE_ERRORS,
  SUCCES_TOKEN,
  WRONG_TOKEN
} from "../actions/actionTypes";
import { stat } from "fs";

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
    case LOGIN_SUCCESS:
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        userInfo: payload
      };
    case LOGIN_FAIL:
    case AUTH_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
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

export const registerInitState = {
  register_success: "",
  errors: {
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: ""
  }
};

export const registerReducer = (state = registerInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SUCCESS_REGISTRATION:
      return {
        ...state,
        register_success: "ok"
      };
    case FAILIED_REGISTRATION:
      return {
        ...state,
        register_message: payload.message,
        errors: payload.errors
      };
    case REMOVE_ERRORS:
      return (state = registerInitState);
    default:
      return state;
  }
};

export const tokenvalidationInitState = {
  token_valide_message: "",
  token_valide: "this is me before",
  is_loading: true
};
export const passeditReducer = (state = tokenvalidationInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SUCCES_TOKEN:
      return {
        ...state,
        token_valide_message: payload.message,
        token_valide: payload.valide,
        is_loading: false
      };
    case WRONG_TOKEN:
      return {
        ...state,
        token_valide_message: payload.message,
        token_valide: payload.valide,
        is_loading: false
      };
    default:
      return state;
  }
};
