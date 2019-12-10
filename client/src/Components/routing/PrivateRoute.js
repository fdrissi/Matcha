import React from "react";
import { Route } from "react-router-dom";
import { useUserStore } from "../../Context/appStore";
import Login from "../auth/Login";

const PrivateRoute = ({ component, ...rest }) => {
  const [{ auth }] = useUserStore();
  const finaleComponent = auth.isAuthenticated ? component : Login;
  if (auth.userInfo.loading) return null;
  return <Route {...rest} component={finaleComponent} />;
};

export default PrivateRoute;
