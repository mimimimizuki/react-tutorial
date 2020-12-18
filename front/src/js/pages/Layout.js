import React from "react";
import AuthNav from "../components/AuthNav";
import Navi from '../components/Navi';
import { useAuth0 } from "@auth0/auth0-react";
import LoggedIn from '../components/LoggedIn';

const Layout = () => {
  const { isAuthenticated } = useAuth0();

  const { loading } = useAuth0();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {!isAuthenticated && (
        <AuthNav />
      )}

      {isAuthenticated && <LoggedIn />}
    </div>
  );
};

export default Layout;