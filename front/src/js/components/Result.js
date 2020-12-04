import React from 'react';
import Posts from './Posts'
import { Card , Container} from "react-bootstrap";
export default class Result extends React.Component{
    constructor(props) {
        super()
        this.state = {
            posts : [],
        }
    }
    render() {
        console.log("here")
        for (let i = 0; i < this.props.tags.length; i++){
            this.state.posts.push(
                <Posts key={this.props.tags[i].ID} title={this.props.tags[i].Title} overview={this.props.tags[i].Overview}
                link={this.props.tags[i].Link} thought={this.props.tags[i],Thought} id={this.props.tags[i].ID} tags={this.props.tags[i].tags}/>
            );
            this.setState({posts: this.state.posts});
        }
        return (
            <div>
                検索結果
                <Container >
                <Card.Header >
                    <div>
                        {this.state.posts}
                    </div>
                </Card.Header>
                </Container>
            </div>
        )
    }
}