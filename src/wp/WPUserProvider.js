import React, { useEffect, useState, useContext } from "react";

export const WPUserContext = React.createContext();

export const WPUserProvider = (props) => {
  const [session, setSession] = useState({
    user: null,
    loading: true,
    isAdmin: false,
  });

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      let isAdmin = false;

      if (user) {
        const token = await user.getIdTokenResult();
        isAdmin = token.claims.admin;
      }

      setSession({ loading: false, user, isAdmin });
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={session}>
      {!session.loading && props.children}
    </UserContext.Provider>
  );
};

export const useSession = () => {
  const session = useContext(UserContext);
  return session;
};