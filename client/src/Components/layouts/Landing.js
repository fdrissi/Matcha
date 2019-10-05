import React from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import Section from "./Section";
import Footer from "./Footer";

const Landing = () => {
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ paddingBottom: "15rem" }}>
        <Slider />
        <Section />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
