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

        const url = "http://localhost:5000/posts/"+post_id+"/detail";
        axios.get(url).then((res) => {
            console.log(res.data)
            this.state.postList.push(
            <Posts key={res.data.ID} title={res.data.Title} overview={res.data.Overview} link={res.data.Link} thought={res.data.Thought} tags={res.data.Tags} id={res.data.ID} me={true}
            />);
            this.setState({postList : this.state.postList});
        }).catch((error) => {
            console.log(error)
        });
    }
    render() {
        return (
            <div>
                <div>
                {this.state.postList}
                </div>
            </div>
        );
    }
}

export default withRouter(User);