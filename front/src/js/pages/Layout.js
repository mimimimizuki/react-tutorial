import React from "react";
import AuthNav from "../components/Navi";
import Navi from '../components/AuthNavi';
import { useAuth0 } from "@auth0/auth0-react";

function Layout(props){
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="App">
      {!isAuthenticated && (
        <AuthNav />
      )}

      {isAuthenticated && <Navi />}
      {isAuthenticated && props.children }
    </div>
  );
};

export default Layout;