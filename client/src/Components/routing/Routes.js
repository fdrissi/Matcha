import React from "react";
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
  const access = auth.userInfo.info_verified;
<<<<<<< HEAD
  console.log("profile", profile);
  //console.log("access", auth.userInfo.info_verified);
=======
  console.log("access ", access);
>>>>>>> 529af0314c23397527e95043cd17fc519c820d84
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
        <PrivateRoute exact path="/profile/:id?" component={Profile} />
        <PrivateRoute
          exact
          path="/history"
          component={access ? History : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/browse"
          component={access ? Browse : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/search"
          component={access ? Search : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/chat"
          component={access ? Chat : Edit_Profile}
        />
        <PrivateRoute
          exact
          path="/notifications"
          component={access ? Notifications : Edit_Profile}
        />
        <PrivateRoute exact path="/edit-profile" component={Edit_Profile} />
        <Route path="" component={Notfound} />
      </Switch>
    </div>
  );
};

export default Routes;
