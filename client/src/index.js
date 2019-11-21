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
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
  typography: {
    fontFamily: [
      "Ubuntu",
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif"
    ].join(",")
  }
});

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
  <ThemeProvider theme={theme}>
    <UserProvider>
      <App />
    </UserProvider>
  </ThemeProvider>,
  document.getElementById("root")
);
