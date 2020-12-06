import React from "react";
import { Image } from "react-bootstrap";
import axios from 'axios';
import MyInfo from '../components/MyInfo';
export default class User extends React.Component{
    constructor(props) {
        super();
        this.state = {user_name : "", user_bio : ""}
    }
    componentDidMount(){
        const query = new URLSearchParams(this.props.location.search);
        const user_id = query.get('id');
        axios.get("http://localhost:5000/users/" + user_id).then(res => {
            this.setState({ user_name: res.data.DisplayName, user_bio : res.data.BIO});
        }).catch(err => {
            console.log(err);
            this.props.history.push("/404");
        })
    }
    render() {
        return (
            <div>
                <MyInfo name={this.state.user_name} bio={this.state.user_bio} following="10" follower="10" other="yes"/>
            </div>
        );
    }
}