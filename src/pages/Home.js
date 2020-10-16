import React from "react";
import Intro from "../components/home/Intro";
import Talks from "../components/home/Talks";
import Classes from "../components/home/Classes";
import Projects from "../components/home/Projects";
import About from "../components/home/About";
// import Education from '../components/home/Education'

const Home = () => {
  return (
    <>
      <Intro />
      <Talks />
      <Classes />
      <Projects />
      <About />
      {/* <Education /> */}
    </>
  );
};

export default Home;
