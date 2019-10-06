import React from "react";
import { Route } from "react-router-dom";
import Login from "./auth/Login";

const PrivateRoute = ({ to, component, isLogged }) => {
  return (
    <>
      <Route exact path={to} component={isLogged ? component : Login} />
    </>
  );
};

export default PrivateRoute;
