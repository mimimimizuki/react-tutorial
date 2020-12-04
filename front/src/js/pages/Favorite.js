import React from "react";
import Posts from '../components/Posts'
import { Card , Container} from "react-bootstrap";
import axios from 'axios';
export default class Favorite extends React.Component{
    constructor(props) {
        super()
        this.state = {Posts:[]}
    }
    componentDidMount(e) {
        const getUrl = "http://localhost:5000/favorites/1";
        axios.get(getUrl).then((res) => {
            res.data.forEach(doc => {
                var flg = false
                if (doc.UserId == 1){
                    flg = true
                }
                this.state.Posts.push(
                    <Posts key={doc.ID}  title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={doc.me}/>
                );
                this.setState({Posts: this.state.Posts})
            });
        }).catch(err => {
            console.log(err)
        });
    }
    render() {
        return (
            <div>
                <Container className="favorites">
                <div className="favorites">
                    {this.state.Posts}
                </div>
                </Container>
            </div>
        );
    }
}