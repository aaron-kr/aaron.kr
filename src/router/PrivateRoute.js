import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useSession } from "../firebase/UserProvider";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { user, isAdmin } = useSession();

  console.log( "Private route: ", user );

  return (
    <Route
      {...rest}
      render={(props) => {
        const id = props.match.params.id;

        if (user && (user.uid === id || isAdmin)) {
          return <Component {...props} />;
        } else {
          return <Redirect to="/login" />;
        }
      }}
    />
  );
};

export default PrivateRoute;
