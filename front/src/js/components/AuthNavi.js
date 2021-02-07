import React from 'react';
import { useForm } from 'react-hook-form';
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import LogoutButton from './LogoutButton';
const AuthNavi = (props) =>  {
    return (
        <Navbar collapseOnSelect expand="xl" id="navColor" variant="dark">
            <LinkContainer to="/">
                <Navbar.Brand>
                    <Image  roundedCircle
                        src='../../images/logo.png'
                        width="50"
                        height="50"
                        alt="React Bootstrap logo"
                    />
                </Navbar.Brand>
            </LinkContainer>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    <LinkContainer to="/">
                        <Nav.Link>Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/timelines">
                        <Nav.Link>Timeline</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/searches">
                        <Nav.Link>Search</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/favorite">
                        <Nav.Link>Favorite</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/setting">
                        <Nav.Link>Setting</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav style={{ marginRight:"10px"}}>
                <LogoutButton />
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}
export default withRouter(AuthNavi);