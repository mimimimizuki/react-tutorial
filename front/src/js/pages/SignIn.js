import React from 'react';
import { Nav, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
import LoginButton from '../components/LoginButton';
import axios from 'axios';
class SignIn extends React.Component{
    handleSubmit(e) {
        e.preventDefault()
        axios.post("http://localhost:5000/login", {
            name : e.target.name, 
            pass : e.target.pass,
        }).then(res =>{
            console.log(res);
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        return (
            <div>
                <LoginButton/>
                <h1 >ここにログインページ</h1>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <ul>
                        <li>
                        <p>name</p>
                        <p><input type="text" name="name" required /></p>
                        </li>
                        <li>
                        <p>Password</p>
                        <p><input type="password" name="password" required /></p>
                        </li>
                    </ul>


                    </form>
                <LinkContainer to="/signup">
                    <Nav.Link >新しい登録ページ</Nav.Link>
                </LinkContainer>
            </div>
        );
    }
}
export default withRouter(SignIn);