import React, { useState } from 'react';
import Modal from 'react-modal';

import { useForm } from "react-hook-form";
import { login, logout } from "../../firebase/auth";
import { wplogin, wplogout } from "../../wp/wpauth";

import { Link, useHistory } from "react-router-dom";
import { useSession } from "../../firebase/UserProvider";

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');
Modal.defaultStyles.overlay.zIndex = 1;
Modal.defaultStyles.overlay.backgroundColor = 'rgba(0,0,0,0.5)';

function LoginModal(){
  // Declare variables
  const [modalIsOpen, setIsOpen] = React.useState(false); // set state "open" to false
  const [isLoading, setLoading] = React.useState(false); // set state "loading" to false
  const { register, handleSubmit, reset, formState } = useForm({
    mode: "onChange"
  });
  const history = useHistory();
  const { user } = useSession();

  /**
   * Modal Functions
   */
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    // subtitle.style.color = '#f00';
  }

  function closeModal(){
    setIsOpen(false);
	}

  /**
   * Login / Logout Functions
   */
  const logoutUser = async () => {
    await logout();
    history.push("/");
	};

  // Firebase Login Redirect
  const routeOnLogin = async (user) => {
    const token = await user.getIdTokenResult();
    if (token.claims.admin) {
			closeModal();
      history.push("/users");
    } else {
			closeModal();
      history.push(`/profile/${user.uid}`);
    }
	};
  
  // WordPress Login Redirect
	const routeOnWPLogin = (user) => {
		const token = user.token;
		if (token) {
			closeModal();
			history.push("/users");
		} else {
			closeModal();
			history.push("/talks");
		}
  }
  
  // Firebase Form Submit
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

  // WordPress Form Submit
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
			routeOnWPLogin(user);
    } else {
      setLoading(false);
    }

  }

  const formClassName = `ui form ${isLoading ? "loading" : ""}`;

  return (
    <div>
      {!user && (
        <li className="site-nav-item">
          <button onClick={openModal}>
            <i className="fa fa-unlock"></i>
          </button>
        </li>
      )}
      {user && (
        <li className="site-nav-item">
          <button onClick={logoutUser}>
            <i className="fa fa-lock"></i>
          </button>
        </li>
      )}
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        {isLoading ? (
          <div>Loading</div>
        ) : (
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
        )}
      </Modal>
    </div>
  );
}

export default LoginModal;