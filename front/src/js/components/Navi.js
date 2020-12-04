import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Result from './Result'
import axios from 'axios';
class Navi extends Component {
    formSubmit(e) {
        e.preventDefault()
        const tagArr = ["情報"]
        const searchUrl = "http://localhost:5000/search"
        var params = new URLSearchParams();
        for (let i = 0; i < tagArr.length; i ++) {
            params.append("tags", tagArr[i])
        }
        console.log(params.getAll("tags"))
        axios.get(searchUrl, {params: params}).then(res => {
            console.log(res);
            if (res.data.length == 0){
                alert("お探しの投稿はありません.")
                return
            }
            return <Result tags={res.data} />
        }).catch(err => {
            console.log(err);
        })
    }
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
                    <Form inline onSubmit={this.formSubmit.bind(this)}>
                        <FormControl type="text" placeholder="調べたい論文のキーワード" className="mr-sm-2" id="search"/>
                        <Button variant="outline-info" type="submit">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default Navi;