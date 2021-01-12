import React, { useEffect } from "react";
import AuthNavi from "../components/AuthNavi";
import Navi from '../components/Navi';
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import {Redirect} from 'react-router-dom';
function Layout(props){
  const { isAuthenticated, isLoading, user } = useAuth0();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  else{
    if (isAuthenticated){
      getSub(user);
    }
    return (
      <div className="App">
        {!isAuthenticated && <Navi /> }
        {!isAuthenticated && <Redirect to="/timeline" />}
  
        {isAuthenticated && <AuthNavi />}
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