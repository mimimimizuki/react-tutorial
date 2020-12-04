import React from 'react';
import Posts from './../components/Posts'
import { Card , Container} from "react-bootstrap";
export default class Result extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            posts : [],
            ids : [],
        }
    }
    componentDidMount(e){
        for (let i = 0; i < this.props.location.state.result.length; i++){
            if (!this.state.ids.includes(this.props.location.state.result[i].ID)){
                this.state.posts.push(
                    <Posts key={this.props.location.state.result[i].ID} title={this.props.location.state.result[i].Title} overview={this.props.location.state.result[i].Overview}
                    link={this.props.location.state.result[i].Link} thought={this.props.location.state.result[i].Thought} id={this.props.location.state.result[i].ID} tags={this.props.location.state.result[i].tags}/>
                );
                this.state.ids.push(this.props.location.state.result[i].ID);
                this.setState({posts: this.state.posts, ids: this.state.ids});
            }
        }
    }
    render() {
        return (
            <div>
                <h1 className="results">検索結果</h1>
                <Container >
                    <div　className="results">
                        {this.state.posts}
                    </div>
                </Container>
            </div>
        )
    }
}