import React from 'react';
import { Card } from "react-bootstrap";
export default class Posts extends React.Component{
    render(){
        return (
            <div>
            <Card style={{ width: '350px' }}>
                <Card.Body>
                    <Card.Title>{this.props.title}
                    </Card.Title>
                    <Card.Link href="#">
                    {this.props.link}
                    </Card.Link>
                </Card.Body>
            </Card>
            </div>
        )
    }
}