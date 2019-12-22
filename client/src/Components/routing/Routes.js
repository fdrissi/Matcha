import React, { useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { useUserStore } from "../../Context/appStore";
import Landing from "../layouts/Landing";
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
import Search from "../pages/Search";
import Chat from "../pages/Chat";
import Edit_Profile from "../profile/Edit_Profile";
import Notfound from "../pages/Notfound";
import PrivateRoute from "./PrivateRoute";

const Routes = () => {
  const [{ auth, profile }] = useUserStore();
  useEffect(() => {
    console.log(profile.Verification.isVrified);
  }, [profile.Verification.isVrified]);
  return (
    <div style={{ flex: 1 }}>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute exact path="/setting" component={Setting} />
        <Route exact path="/activate/:username/:token" component={Activate} />
        <Route exact path="/recover" component={Recover} />
        <Route exact path="/editpass/:token/" component={Editpass} />
        <PrivateRoute
          exact
          path="/profile/:id?"
          component={profile.Verification.isVrified ? Profile : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/history"
          component={profile.Verification.isVrified ? History : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/browse"
          component={profile.Verification.isVrified ? Browse : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/search"
          component={profile.Verification.isVrified ? Search : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/chat"
          component={profile.Verification.isVrified ? Chat : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/notifications"
          component={
            profile.Verification.isVrified ? Notifications : Edit_Profile
          }
        />
        <PrivateRoute exact path="/edit-profile" component={Edit_Profile} />
        <Route path="" component={Notfound} />
      </Switch>
    </div>
  );
};

export default Routes;
