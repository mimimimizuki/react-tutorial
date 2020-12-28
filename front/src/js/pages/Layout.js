import React, { useEffect } from "react";
import AuthNav from "../components/Navi";
import Navi from '../components/AuthNavi';
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
function Layout(props){
  const { isAuthenticated, isLoading, user } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  else{
    getSub(user);
    return (
      <div className="App">
        {!isAuthenticated && (
          <AuthNav />
        )}
  
        {isAuthenticated && <Navi />}
        {isAuthenticated && props.children }
      </div>
    );
  }
  
};

export default Layout;

const  getSub = async (user) => {
  const sub = await user.sub;
  const res = await axios.get("http://localhost:5000/users/"+sub);
  return res.ID
}