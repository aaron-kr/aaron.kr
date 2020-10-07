import React, { Component } from "react";
import { Switch, BrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";
import Intro from "./components/home/Intro";
import Talks from "./components/home/Talks";
import Classes from "./components/home/Classes";
import Projects from "./components/home/Projects";
import About from "./components/home/About";
// import Education from './components/home/Education'

import "./firebase/config";
import { UserProvider } from "./firebase/UserProvider";

import "./pages/SignUp";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProfileRedirect from "./router/ProfileRedirect";
import PrivateRoute from "./router/PrivateRoute";

class App extends Component {
  render() {
    return (
      <UserProvider>
        <BrowserRouter>
          <div className="site">
            <Header />
            <main className="site-main" role="main">
              <Switch>
                <ProfileRedirect exact path="/login" component={Login} />
                <ProfileRedirect exact path="/signup" component={Signup} />
                <PrivateRoute exact path="/profile/:id" component={Profile} />
              </Switch>
              <Intro />
              <Talks />
              <Classes />
              <Projects />
              <About />
              {/* <Education /> */}
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </UserProvider>
    );
  }
}

export default App;
