import React from 'react';
import { Card } from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import axios from 'axios';
export default class Posts extends React.Component{
    constructor (props) {
        super()
        this.state = {liked : false}
    }
    handleClick(e) {
        this.setState({ liked: !this.state.liked});
        console.log(this.state.liked);
        if (this.state.liked){
            var params = new URLSearchParams();
            params.append("PostId", 1);
            params.append("UserId", 1);
            axios.post("http://localhost:5000/favorites", params);
            console.log("here")
        }
    }
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
                    <br></br> {this.state.liked ? 
                    <BsFillHeartFill onClick={this.handleClick.bind(this)}/>
                     : 
                    <BsHeart onClick={this.handleClick.bind(this)}/>
                    }
                    <button><BsFillReplyFill /></button>
                </Card.Body>
            </Card>
            </div>
        )
    }
}