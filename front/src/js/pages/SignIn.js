import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { withRouter } from 'react-router-dom';
class SignIn extends React.Component{
    render() {
        return (
            <div>
                <h1 >ここにログインページ</h1>
                <LinkContainer to="/signup">
                    <Nav.Link >新しい登録ページ</Nav.Link>
                </LinkContainer>
            </div>
        );
    }
}
export default withRouter(SignIn);