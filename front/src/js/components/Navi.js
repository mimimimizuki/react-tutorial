import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

class Navi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result : [],
            init : true,
            form : "",
        }
    }
    formSubmit(e) {
        e.preventDefault()
        var tagArr = new Array();
        if (this.state.form.includes(",")){
            tagArr = this.state.form.split(",")
        } else{
            tagArr = this.state.form.split(" ");
        }
        const searchUrl = "http://localhost:5000/search"
        var params = new URLSearchParams();
        for (let i = 0; i < tagArr.length; i ++) {
            if (tagArr[i].includes("#")){
                tagArr.replace("#", "");
            }
            params.append("tags", tagArr[i])
        }
        console.log(params.getAll("tags"))
        axios.get(searchUrl, {params: params}).then(res => {
            console.log(res);
            if (res.data.length == 0){
                alert("お探しの投稿はありません.")
                return
            }
            else{
                this.setState({ result : res.data, init : false});
            }
        }).catch(err => {
            console.log(err);
        });
    }
    handleChange(e){
        this.setState({ form : e.target.value});
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
                        {this.state.result &&  !this.state.init != [] ? <Redirect to={{
                            pathname : "/result", 
                            state: {result: this.state.result}
                        }}
                        />
                        : 
                        <></>
                        }
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default Navi;