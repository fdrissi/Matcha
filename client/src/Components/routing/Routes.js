import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "../auth/Login";
import Register from "../auth/Register";
import Setting from "../user/Setting";
import Activate from "../auth/Activate";
import Recover from "../auth/Recover";
import Editpass from "../auth/Editpass";
import { Profile } from "../profile/Profile";
import { Notifications } from "../pages/Notifications";
import Browse from "../pages/Browse";

const Routes = () => {
  return (
    <div style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register/" component={Register} />
        <Route exact path="/setting" component={Setting} />
        <Route exact path="/activate/:username/:token" component={Activate} />
        <Route exact path="/recover" component={Recover} />
        <Route exact path="/editpass/:token/" component={Editpass} />
        <Route exact path="/profile" component={Profile} />
        <Route exact path="/browse" component={Browse} />
        <Route exact path="/notifications" component={Notifications} />
      </Switch>
    </div>
  );
};

export default Routes;
