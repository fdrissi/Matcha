import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { UserProvider, useUserStore } from "./Context/appStore";
import { LoadUserComponent } from "./LoadUser";
import { loadUser } from "./actions/userAction";
import Navbar from "./Components/inc/Navbar";
import Landing from "./Components/layouts/Landing";
import Routes from "./Components/routing/Routes";
import Footer from "./Components/inc/Footer";

function App() {
  const [, dispatch] = useUserStore();

  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <LoadUserComponent loadUser={loadUser} dispatch={dispatch} />
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Landing} />
          <Route component={Routes} />
        </Switch>
        <Footer style={{ flex: 1 }} />
      </Router>
    </div>
  );
}

ReactDOM.render(
  <UserProvider>
    <App />
  </UserProvider>,
  document.getElementById("root")
);
