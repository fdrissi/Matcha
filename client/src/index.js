import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import Navbar from "./Components/layouts/Navbar";
import Slider from "./Components/layouts/Slider";
import Section from "./Components/layouts/Section";
import Footer from "./Components/layouts/Footer";
import "./index.css";

function App() {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <BrowserRouter>
        <Route exact path='/' component={Navbar} />
        <div style={{ paddingBottom: "15rem" }}>
          <Slider />
          <Section />
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
