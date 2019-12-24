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
import { matchedReducer, matchedInitState } from "../Reducers/matchedReducer";
import { chatReducer, chatInitState } from "../Reducers/chatReducer";
import io from "socket.io-client";
const socket = io("http://localhost:5000");

export const appStore = React.createContext();
export const socketStore = React.createContext();

const StoreProvider = ({ children }) => {
  return <socketStore.Provider value={socket}>{children}</socketStore.Provider>;
};

export const UserProvider = ({ children }) => {
  const globalReducers = useCombinedReducers({
    alert: useReducer(alertReducer, alertInitState),
    auth: useReducer(authReducer, authInitState),
    operations: useReducer(operationsReducer, errorsInitState),
    profile: useReducer(profileReducer, profileInitState),
    token: useReducer(passeditReducer, tokenvalidationInitState),
    matches: useReducer(matchedReducer, matchedInitState),
    chat: useReducer(chatReducer, chatInitState)
  });
  return (
    <StoreProvider>
      <appStore.Provider value={globalReducers}>{children}</appStore.Provider>
    </StoreProvider>
  );
};

export const useUserStore = () => useContext(appStore);
export const useSocketStore = () => useContext(socketStore);
