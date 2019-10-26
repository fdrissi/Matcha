import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Setting from "../user/Setting";
import activate from "../auth/Activate";

const Routes = () => {
  return (
    <Container component="main" style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register/" component={Register} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/activate/:username/:token" component={activate} />
      </Switch>
    </Container>
  );
};

export default Routes;
