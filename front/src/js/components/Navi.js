import React, { Component } from 'react';
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import { useAuth0 } from '@auth0/auth0-react';
class Navi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result : [],
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
                this.setState({ result : res.data});
                return this.props.history.push({
                    pathname : "/result", 
                    state: {result: this.state.result}
                })
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
                        <LinkContainer to="/favorite">
                            <Nav.Link>Favorite</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/setting">
                            <Nav.Link>Setting</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                    <Nav style={{ marginRight:"10px"}}>
                    <LogoutButton />
                    </Nav>
                    <Form inline onSubmit={this.formSubmit.bind(this)}>
                        <FormControl type="text" placeholder="調べたい論文のキーワード" className="mr-sm-2" id="search" value={this.state.form} onChange={this.handleChange.bind(this)}/>
                        <Button variant="outline-info" type="submit" size="lg">Search</Button>
                    </Form>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}
export default withRouter(Navi);