import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Register from "./Components/auth/Register";
import Login from "./Components/auth/Login";
import Landing from "./Components/layouts/Landing";
import "./index.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path='/register' component={Register} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/' component={Landing} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
