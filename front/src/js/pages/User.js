import React from "react";
import { Image, CardGroup, Card } from "react-bootstrap";
import axios from 'axios';
import MyInfo from '../components/MyInfo';
import { withRouter } from 'react-router-dom';
class User extends React.Component{
    constructor(props) {
        super(props);
        this.state = {user_name : "", user_bio : "", postList: [],
        yetPostList: [],
        }
    }  
    componentDidMount(e){
        console.log("here")
        const query = new URLSearchParams(this.props.location.search);
        const user_id = query.get('id');
        axios.get("http://localhost:5000/users/" + user_id).then(res => {
            this.setState({ user_name: res.data.DisplayName, user_bio : res.data.BIO});
        }).catch(err => {
            console.log(err);
            this.props.history.push("/404");
        });

        const url = "http://localhost:5000/posts/"+user_id;
        axios.get(url).then((res) => {
            res.data.forEach((doc) => {
                this.state.postList.push(
                <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true}
                />);
                this.setState({postList : this.state.postList});
            });
        }).catch((error) => {
            console.log(error)
        });
        const yeturl = "http://localhost:5000/wantReads/"+user_id;
        axios.get(yeturl).then((res) => {
            res.data.forEach((doc) => {
                this.state.yetPostList.push(
                    <YetPosts key={doc.ID} title={doc.Title} link={doc.Link} id={doc.ID}/>
                );
                this.setState({yetPostList : this.state.yetPostList});
            });
        }).catch((error) => {
            console.log(error)
        });
    }
    render() {
        return (
            <div>
                <MyInfo name={this.state.user_name} bio={this.state.user_bio} following="10" follower="10" other="yes"/>
                <CardGroup className = 'm-4' style={{ width: '100vm' }}>
                        <Card.Header style={{ width: '50%' }}><Button variant="info" size="lg" onClick={this.handleShow}>読んだ論文を投稿</Button>
                                {
                                this.state.postList.length == 0 ? "no post"
                                 :
                                 <div>{this.state.postList}</div>
                                }
                        </Card.Header>
                        <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}><Button variant="secondary" size="lg" onClick={this.wantread_handleShow}>気になる論文を投稿</Button>
                                {
                                this.state.yetpostList.length == 0 ? "no post"
                                 :
                                 <div>{this.state.yetpostList}</div>
                                }
                        </Card.Header>
                </CardGroup>
            </div>
        );
    }
}

export default withRouter(User);