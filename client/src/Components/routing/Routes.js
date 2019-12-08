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
import { History } from "../pages/History";
import Browse from "../pages/Browse";
import Chat from "../pages/Chat";
import Edit_Profile from "../profile/Edit_Profile";
import PrivateRoute from "./PrivateRoute";
import { useUserStore } from "../../Context/appStore";

const Routes = () => {
  const [{ auth }] = useUserStore();

  return (
    <div style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute auth={auth} exact path="/setting" component={Setting} />
        <Route exact path="/activate/:username/:token" component={Activate} />
        <Route exact path="/recover" component={Recover} />
        <Route exact path="/editpass/:token/" component={Editpass} />
        <PrivateRoute
          auth={auth}
          exact
          path="/profile/:id"
          component={Profile}
        />
        <PrivateRoute auth={auth} exact path="/history" component={History} />
        <PrivateRoute auth={auth} exact path="/browse" component={Browse} />
        <PrivateRoute auth={auth} exact path="/chat" component={Chat} />
        <PrivateRoute
          auth={auth}
          exact
          path="/notifications"
          component={Notifications}
        />
        <PrivateRoute
          auth={auth}
          exact
          path="/edit-profile"
          component={Edit_Profile}
        />
      </Switch>
    </div>
  );
};

export default Routes;
