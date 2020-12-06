import React from "react";
import axios from 'axios';
import Posts from '../components/Posts';
import { withRouter } from 'react-router-dom';
class User extends React.Component{
    constructor(props) {
        super(props);
        this.state = {postList: [],}
    }  
    componentDidMount(e){
        console.log("here")
        const query = new URLSearchParams(this.props.location.search);
        const post_id = query.get('id');

        const url = "http://localhost:5000/posts/"+post_id;
        axios.get(url).then((res) => {
            res.data.forEach((doc) => {
                console.log(doc)
                this.state.postList.push(
                <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true}
                />);
                this.setState({postList : this.state.postList});
            });
        }).catch((error) => {
            console.log(error)
        });
    }
    render() {
        return (
            <div>
                <h1>this page is detail about a post
                    </h1>
                <div>
                {this.state.postList}
                </div>
            </div>
        );
    }
}

export default withRouter(User);