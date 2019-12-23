import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import axios from "axios";
import { UserProvider, useUserStore } from "./Context/appStore";
import { useSocketStore } from "./Context/appStore";
import { LoadUserComponent } from "./LoadUser";
import { loadUser } from "./actions/userAction";
import Navbar from "./Components/inc/Navbar";
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

axios.interceptors.response.use(
  function(response) {
    if (
      response.data.errorMsg === "Access denied" &&
      window.location.pathname !== "/login" &&
      window.location.pathname !== "/" &&
      window.location.pathname !== "/register" &&
      window.location.pathname !== "/recover" &&
      window.location.pathname.split("/")[1] !== "editpass"
    ) {
      window.location = "/login";
    } else if (response.data.errorMsg === "Verify Profile Info") {
      window.location = "/edit-profile";
    }
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

function App() {
  const [, dispatch] = useUserStore();
  const socket = useSocketStore();
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <LoadUserComponent
        loadUser={loadUser}
        dispatch={dispatch}
        socket={socket}
      />
      <Router>
        <Navbar />
        <Switch>
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
