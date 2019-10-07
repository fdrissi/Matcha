import React from "react";
import Navbar from "./Navbar";
import Slider from "./Slider";
import Section from "./Section";
import Footer from "./Footer";

const Landing = () => {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}
    >
      <Navbar />
      <div style={{ flex: 1 }}>
        <Slider />
        <Section />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
