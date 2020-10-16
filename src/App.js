import React, { Component } from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/shared/Header";
import Footer from "./components/shared/Footer";

import "./firebase/config";
import { UserProvider } from "./firebase/UserProvider";

import "./pages/SignUp";
import Signup from "./pages/SignUp";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import ProfileRedirect from "./router/ProfileRedirect";
import PrivateRoute from "./router/PrivateRoute";
import AdminRoute from "./router/AdminRoute";
import Users from "./pages/Users";
import Home from "./pages/Home";
import Sites from "./pages/Sites";
import SiteSingle from "./pages/SiteSingle";
import SiteAdd from "./pages/SiteAdd";
import Talks from "./components/home/Talks";
import Classes from "./components/home/Classes";
import Projects from "./components/home/Projects";
import Admin from "./pages/Admin";

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
                <AdminRoute exact path="/users" component={Users} />
                <AdminRoute exact path="/sites" component={Sites} />
                <AdminRoute exact path="/add-site" component={SiteAdd} />
                <AdminRoute exact path="/site/:id" component={SiteSingle} />
                <AdminRoute exact path="/admin" component={Admin} />
                <Route exact path="/" component={Home} />
                <Route exact path="/talks" component={Talks} />
                <Route exact path="/courses" component={Classes} />
                <Route exact path="/projects" component={Projects} />
              </Switch>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </UserProvider>
    );
  }
}

export default App;
