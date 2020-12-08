import React from 'react';
import { Card, Dropdown } from "react-bootstrap";
export default class Posts extends React.Component{
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
        axios.delete("http://localhost:5000/wantreads/1").then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
    render(){
        return (
            <div>
                <Card>
                <Dropdown>
                    <Dropdown.Toggle className="detail"variant="secondary">more action</Dropdown.Toggle>
                    <Dropdown.Menu>
                    <Dropdown.Item onClick={this.handleUpdateClick.bind(this)}>読んだ！</Dropdown.Item>
                    <Dropdown.Item onClick={this.handleDeleteClick.bind(this)}>もう読まない</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Card.Body>
                    <Card.Title>{this.props.title}
                    </Card.Title>
                    <Card.Link href={this.props.link}>
                    {this.props.link}
                    </Card.Link>
                </Card.Body>
                </Card>
            </div>
        )
    }
}