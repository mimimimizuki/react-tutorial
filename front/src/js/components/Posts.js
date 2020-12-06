import React from 'react';
import { Card, Image ,OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import axios from 'axios';
export default class Posts extends React.Component{
    constructor (props) {
        super(props)
        this.state = {liked : false, post_id: "", me: false, user_id : 1}
        axios.defaults.baseURL = 'http://localhost:8080';
    }
    componentDidMount(e) {
        const getUrl = "http://localhost:5000/favorites/1";
        axios.get(getUrl).then((res) => {
            res.data.forEach(doc => {
                if (doc.ID == this.props.id){
                    this.setState({liked: true, post_id: doc.ID});
                }
            });
        }).catch(err => {
            console.log(err)
        });
        if (this.props.me){
            this.setState({me:true})
        }
    }
    handleClick(e) {
        if (!this.state.liked){ // add favorite 
            var params = new URLSearchParams();
            params.append("PostId", this.props.id);
            params.append("UserId", 1);
            axios.post("http://localhost:5000/favorites", params)
            .then(response => {
                console.log(response.data);
                this.setState({like_id: response.data}); // get favorite id 
            }).catch(err => {
                console.log(err);
            });
            this.setState({ liked : true})
        } else {
            var params = new FormData();
            params.append("PostId", this.state.post_id)
            params.append("UserId", 1)
            fetch('http://localhost:5000/favorites',{
                method: "DELETE",
                body:params,
                header: {
                    'Content-Type': 'application/json; charset=UTF-8'
                  }
            }).then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });

            this.setState({ liked : false})
        }
    }
    handleOtherPage(e) {
        return this.props.history("/users/"+this.state.user_id);
    }
    render(){
        var ooo = "";
        if (this.props.tags != null) {
            ooo = this.props.tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>);
        }
        return (
            <div>
            <Card >
            {this.state.me ? <Image src="../../images/logo.png"  roundedCircle onClick={this.handleOtherPage.bind(this)}
                style={{ height: 50, width: 50}} /> : 
                <Image src="../../images/logo2.png"  roundedCircle onClick={this.handleOtherPage.bind(this)}
                style={{ height: 50, width: 50}} />
            }
                <Card.Body  id="post">
                    <Card.Title>{this.props.title}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{this.props.overview}</Card.Subtitle>
                    <Card.Text>
                    {this.props.thought}
                    </Card.Text>
                    {ooo}
                    <br></br>
                    <Card.Link href={this.props.link}>
                        {this.props.link}
                    </Card.Link>
                    <br></br>
                </Card.Body>
                {this.state.liked ? 
                    <BsFillHeartFill className="heart" color="#e57373" size="30px"  onClick={this.handleClick.bind(this)}/>
                     : 
                     <OverlayTrigger overlay={<Tooltip id="tooltip-like">like!</Tooltip>}>
                     <BsHeart className="heart" size="30px" onClick={this.handleClick.bind(this)}/>
                    </OverlayTrigger>
                    
                }
                <OverlayTrigger overlay={<Tooltip id="tooltip-reply">reply this post</Tooltip>}>
                <BsFillReplyFill size="30px" className="reply" color="dimgray"/>
                </OverlayTrigger>
            </Card>
            </div>
        )
    }
}