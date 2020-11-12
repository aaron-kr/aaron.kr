import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { login, logout } from "../firebase/auth";
import { wplogin, wplogout } from "../wp/wpauth";

function Login(props) {
  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange"
  });
  const [isLoading, setLoading] = useState(false);

  const routeOnLogin = async (user) => {
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
      props.history.push("/users");
    } else {
      props.history.push(`/profile/${user.uid}`);
    }
  };

  const onSubmit = async (data) => {
    let user;
    setLoading(true);
    try {
      user = await login(data);
      reset();
    } catch (error) {
      console.log(error);
    }

    if (user) {
      routeOnLogin(user);
    } else {
      setLoading(false);
    }
  };

  const onSubmitWP = async (data) => {
    let user;
    setLoading(true);
    try {
      user = await wplogin(data);
      reset();
    } catch (error) {
      console.log(error)
    }

    if (user) {
      console.log("Success! We have a user!");
    } else {
      setLoading(false);
    }

  }

  const formClassName = `ui form ${isLoading ? "loading" : ""}`;

  return (
    <div className="login-container">
      <div className="ui card login-card">
        <div className="content">
          <form className={formClassName} onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={register}
                />
              </label>
            </div>
            <div className="field">
              <label>
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  ref={register}
                />
              </label>
            </div>
            <div className="field actions">
              <button className="ui primary button login" type="submit">
                Login
              </button>
              or
              <Link to="/signup">Sign Up</Link>
            </div>
          </form>

          <hr />

          <form
             className={formClassName} 
             onSubmit={handleSubmit(onSubmitWP)}
          >
            <label htmlFor="wp_user_login">
              Username:
              <input
                type="text"
                id="wp_user_name"
                name="username"
                placeholder="Username"
                ref={register}
                onChange={() => console.log("Uname input ", formState.touched)}
              />
            </label>
            <br/>
            <label htmlFor="wp_user_pass">
              Password:
              <input
                type="password"
                id="wp_user_pass"
                name="pass"
                placeholder="Password"
                ref={register}
                onChange={() => console.log("Pword input ", formState.touched)}
              />
            </label>
            <br/>
            <button 
              type="submit"
              id="login_button"
              disabled={
                !formState.dirty ||
                (formState.dirty && formState.touched.pass !== true) ||
                (formState.dirty && !formState.isValid)
              }
            >
              Log In with WP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
