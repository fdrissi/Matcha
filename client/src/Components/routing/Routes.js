import React from "react";
import { Route, Switch } from "react-router-dom";
import { Container } from "@material-ui/core";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Setting from "../user/Setting";
import Activate from "../auth/Activate";
import Recover from "../auth/Recover";
import Editpass from "../auth/Editpass";

const Routes = () => {
  return (
    <Container component="main" style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register/" component={Register} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/activate/:username/:token" component={Activate} />
        <Route exact path="/recover" component={Recover} />
        <Route exact path="/editpass/:token/" component={Editpass} />
      </Switch>
    </Container>
  );
};

export default Routes;
