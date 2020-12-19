import React from "react";
import AuthNav from "../components/AuthNav";
import Navi from '../components/Navi';
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

      {isAuthenticated && <div><Navi /> {props.children}</div>}
    </div>
  );
};

export default Layout;