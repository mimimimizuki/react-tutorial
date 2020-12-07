import React from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Image ,OverlayTrigger, Tooltip, DropdownButton, Dropdown} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart, BsThreeDots } from "react-icons/bs";
class User extends React.Component{
    constructor(props) {
        super(props);
        this.state = {title:"", overview:"", 
        thought:"", link:"", tags : [],me:false, post_id: "", liked : false, isOpen: false};
    }  
    componentDidMount(e) {

        // postを取得
        const query = new URLSearchParams(this.props.location.search);
        const post_id = query.get('id');
        const url = "http://localhost:5000/posts/"+post_id+"/detail";
        axios.get(url).then((res) => {
            console.log(res.data);
            this.setState({ title:res.data.Title, overview:res.data.Overview, 
            thought:res.data.Thought, link:res.data.Link, tags : res.data.Tags, post_id: res.data.ID})
        }).catch((error) => {
            console.log(error)
        });

        //そのpostがファボしたものかを確認する
        const getUrl = "http://localhost:5000/favorites/1";
        axios.get(getUrl).then((res) => {
            res.data.forEach(doc => {
                if (doc.ID == this.state.post_id){
                    this.setState({liked: true,});
                    if (doc.UserId == 1){
                        this.setState({ me : true});
                    }
                }
            });
        }).catch(err => {
            console.log(err)
        });
    }
    handleClick(e) {
        console.log(this.state);
        if (!this.state.liked){ // add favorite 
            var params = new URLSearchParams();
            params.append("PostId", this.state.post_id);
            params.append("UserId", 1);
            axios.post("http://localhost:5000/favorites", params)
            .then(response => {
                console.log(response.data);
                this.setState({like_id: response.data}); // get favorite id 
            }).catch(err => {
                console.log(err);
            });
            this.setState({ liked : true})
        } else { //delete favorite
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
    handleUpdateClick(e) {
        axios.put("http://localhost:5000/posts",{
            "PostId": this.state.post_id, 
            "Title" : this.state.title, 
            "Overview": this.state.overview,
            "Link": this.state.link,
            "Thought" : this.state.thought,
            "Tags" : this.state.tags,
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    handleDeleteClick(e) {
        axios.delete("http://localhost:5000/posts/"+this.state.post_id).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    showDropDown() {
        this.setState({ isOpen : !this.state.isOpen});
    }
    render() {
        var ooo = "";
        if (this.state.tags != null) {
            ooo = this.state.tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>);
        }
        return (
            <div>
                <div>
                <Card >
                {this.state.me ? 
                        <Image src="../../images/logo.png"  roundedCircle onClick={() => this.handleOtherPage(id)}
                        style={{ height: 50, width: 50}} />
                    : 
                    <Image src="../../images/logo2.png"  roundedCircle onClick={() => this.handleOtherPage(id)}
                    style={{ height: 50, width: 50}} />
                }
                    <Card.Body  id="post">
                        <Card.Title >{this.state.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">{this.state.overview}</Card.Subtitle>
                        <Card.Text>
                        {this.state.thought}
                        </Card.Text>
                        {ooo}
                        <br></br>
                        <Card.Link href={this.state.link}>
                            {this.state.link}
                        </Card.Link>
                        <br></br>
                    </Card.Body>
                    <div>
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
                    {this.state.me &&
                        <DropdownButton id="detail" title="mode action " variant="dark">
                            <Dropdown.Item onClick={this.handleUpdateClick.bind(this)}>update</Dropdown.Item>
                            <Dropdown.Item onClick={this.handleDeleteClick.bind(this)}>delete</Dropdown.Item>
                        </DropdownButton>
                    }
                    </div>
                </Card>
                </div>
            </div>
        );
    }
}

export default withRouter(User);