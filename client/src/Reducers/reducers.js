import { useReducer } from "react";
import useCombinedReducers from "use-combined-reducers";
import { alertReducer, alertInitState } from "./alert";
import { authReducer, authInitState } from "./auth";

export const globalReducers = useCombinedReducers({
  alert: useReducer(alertReducer, alertInitState),
  auth: useReducer(authReducer, authInitState)
});
