import React from 'react';
import { Card } from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
export default class Posts extends React.Component{
    render(){
        return (
            <div>
            <Card style={{ width: '350px' }}>
                <Card.Body>
                    <Card.Title>{this.props.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.overview}</Card.Subtitle>
                    <Card.Text>
                    {this.props.thought}
                    </Card.Text>
                    <Card.Link href={this.props.link}>
                        {this.props.link}
                    </Card.Link>
                    <br></br> <button><BsFillHeartFill /> </button>  <button><BsFillReplyFill /></button>
                </Card.Body>
            </Card>
            </div>
        )
    }
}