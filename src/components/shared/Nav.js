import React from "react";
import "./Nav.css";

import { logout } from "../../firebase/auth";
import { Link, useHistory } from "react-router-dom";
import { useSession } from "../../firebase/UserProvider";

function Nav() {
  const history = useHistory();
  const { user } = useSession();

  const logoutUser = async () => {
    await logout();
    history.push("/login");
  };

  return (
    <nav className="site-navigation navbar" role="navigation">
      <ul className="main-menu">
        <li className="site-nav-item">
          <a href="https://aaron.kr/content/talks/" data-scroll="talks">
            Talks
          </a>
        </li>
        <li className="site-nav-item">
          <a
            href="https://aaron.kr/content/talks/google-classroom-101/"
            data-scroll="classes"
          >
            Classes
          </a>
        </li>
        <li className="site-nav-item">
          <a href="https://aaronsnowberger.com" data-scroll="projects">
            Projects
          </a>
        </li>
        <li className="site-nav-item">
          <a href="https://linkedin.com/in/aaronsnowberger" data-scroll="about">
            About
          </a>
        </li>
        {!user && (
          <li className="site-nav-item">
            <Link to="/login">Login</Link>
          </li>
        )}
        {user && (
          <li className="site-nav-item">
            <button onClick={logoutUser}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Nav;
