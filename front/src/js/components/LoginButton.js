import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Nav } from 'react-bootstrap';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  return (
    <Nav>
      <Nav.Link onClick={() => loginWithRedirect({})}>
      Log In
      </Nav.Link>
    </Nav>
    
  );
};

export default LoginButton;