import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  SUCCESS_REGISTRATION,
  FAILIED_REGISTRATION,
  REMOVE_ERRORS,
  SUCCESS_UPDATE_USER,
  FAILIED_UPDATE_USER,
  SUCCES_TOKEN,
  WRONG_TOKEN,
  REMOVE_SPECIFIC_ERROR
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

export const errorsInitState = {
  success: false,
  errors: {
    email: "",
    userName: "",
    firstName: "",
    lastName: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    current_occupancy: "",
    city: "",
    birth_day: "",
    birth_month: "",
    birth_year: "",
    biography: "",
    relationship: "",
    birthday: "",
    tags: ""
  }
};

export const operationsReducer = (state = errorsInitState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SUCCESS_REGISTRATION:
    case SUCCESS_UPDATE_USER:
      return {
        ...state,
        success: true
      };
    case FAILIED_REGISTRATION:
      return {
        ...state,
        register_message: payload.message,
        success: false,
        errors: payload.errors
      };
    case FAILIED_UPDATE_USER:
      return {
        ...state,
        success: false,
        errors: payload.errors
      };
    case REMOVE_ERRORS:
      return (state = errorsInitState);
    case REMOVE_SPECIFIC_ERROR:
      return { ...state, errors: { ...state.errors, [payload.name]: "" } };
    default:
      return state;
  }
};

export const tokenvalidationInitState = {
  token_valide_message: "",
  token_valide: false,
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
