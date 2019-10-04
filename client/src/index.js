import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./Components/layouts/Navbar";
import Slider from "./Components/layouts/Slider";
import "./index.css";

function App() {
  return (
    <>
      <BrowserRouter>
        <Route exact path='/' component={Navbar} />
        <Slider />
      </BrowserRouter>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
