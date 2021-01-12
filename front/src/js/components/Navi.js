import React from 'react';
import { useForm } from 'react-hook-form';
import { Navbar, Nav, Form, FormControl, Button, Image } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import {  withRouter } from 'react-router-dom';
import LoginButton from './LoginButton';
const Navi = (props) => {
    const { register, handleSubmit, errors} = useForm();
    const onSubmit = (data) => {
        const result = new Array();
        const Mes = new Array();
        console.log(data.tags)
        var tagArr = new Array();
        if (data.tags.includes(",")){
            tagArr = data.tags.split(",")
        } else{
            tagArr = data.tags.split(" ");
        }
        const searchUrl = "http://localhost:5000/search"
        var params = new URLSearchParams();
        for (let i = 0; i < tagArr.length; i ++) {
            if (tagArr[i].includes("#")){
                tagArr[i] = tagArr[i].replace("#", "");
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
                res.data.forEach(doc => {
                    result.push(doc);
                    Mes.push(false)
                });
                console.log("not authenticated")
                return props.history.push({
                    pathname : "/result", 
                    state: {result: result, authorized: false, me: Mes}
                })
            }
        }).catch(err => {
            console.log(err);
        });
    };
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
                </Nav>
                <Nav>
                
                <Nav style={{ marginRight:"10px"}} >
                <LoginButton/>
                </Nav>
                <Form inline onSubmit={handleSubmit(onSubmit)}>
                    <FormControl type="text" placeholder="調べたい論文のキーワード" className="mr-sm-2" id="search" ref={register({ required: true})} name="tags"/>
                    <Button variant="outline-info" type="submit" size="lg">Search</Button>
                    {errors.title && <span>検索内容は必須です</span>}
                </Form>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    ) 
}

export default withRouter(Navi);