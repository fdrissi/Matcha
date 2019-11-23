import React, { useContext } from "react";
import { useReducer } from "react";
import useCombinedReducers from "use-combined-reducers";
import { alertReducer, alertInitState } from "../Reducers/alertReducer";
import {
  authReducer,
  authInitState,
  operationsReducer,
  errorsInitState,
  passeditReducer,
  tokenvalidationInitState
} from "../Reducers/authReducer";
import { profileReducer, profileInitState } from "../Reducers/profileReducer";

export const appStore = React.createContext();

export const UserProvider = ({ children }) => {
  const globalReducers = useCombinedReducers({
    alert: useReducer(alertReducer, alertInitState),
    auth: useReducer(authReducer, authInitState),
    operations: useReducer(operationsReducer, errorsInitState),
    profile: useReducer(profileReducer, profileInitState),
    token: useReducer(passeditReducer, tokenvalidationInitState)
  });
  return (
    <appStore.Provider value={globalReducers}>{children}</appStore.Provider>
  );
};

export const useUserStore = () => useContext(appStore);
