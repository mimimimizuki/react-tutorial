import React from 'react';
import Posts from '../components/Posts'
import { Container} from "react-bootstrap";
import axios from 'axios';
export default class TimeLine extends React.Component{
    constructor(props) {
        super()
        this.state = {Posts: []}
    }
    componentDidMount(e) {
        const postUrl = "http://localhost:5000/posts";
        axios.get(postUrl).then((res) => {
            res.data.forEach(doc => {
                this.state.Posts.push(
                    <Posts key={doc.ID}  title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags}/>
                );
                this.setState({Posts: this.state.Posts})
            });
        }).catch(err => {
            console.log(err)
        })
    }

    render() {
        return (
            <div>
                <Container >
                    <div className="timeline">
                        {this.state.Posts}
                    </div>
                </Container>
            </div>
        )
    }
}