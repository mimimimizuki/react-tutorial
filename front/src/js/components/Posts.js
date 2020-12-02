import React from 'react';
import { Card } from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
export default class Posts extends React.Component{
    render(){
        var ooo = "";
        if (this.props.tags != null) {
            ooo = this.props.tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>);
        }
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
                    {ooo}
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