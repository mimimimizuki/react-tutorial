import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
class Navi extends Component {
    render() {
        return (
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img
                            src='../../images/logo.png'
                            width="30"
                            height="30"
                            alt="React Bootstrap logo"
                        />
                        App
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/timeline">
                            <Nav.Link>Timeline</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/favorite">
                            <Nav.Link>Favorite</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Form inline>
                        <FormControl type="text" placeholder="調べたい論文のキーワード" className="mr-sm-2" />
                        <Button variant="outline-info">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default Navi;