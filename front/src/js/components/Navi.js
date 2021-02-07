import React from 'react';
import { useForm } from 'react-hook-form';
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import {  withRouter } from 'react-router-dom';
import LoginButton from './LoginButton';
const Navi = (props) => {
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
                    <LinkContainer to="/timeline">
                        <Nav.Link>Timeline</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/search">
                        <Nav.Link>Search</Nav.Link>
                    </LinkContainer>
                </Nav>
                <Nav style={{ marginRight:"10px"}} >
                <LoginButton/>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    ) 
}

export default withRouter(Navi);