import React, { useState } from 'react';
import MyInfo from "../components/MyInfo";
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardGroup, Button, Modal, Tabs, Form, Tab, Alert, Container } from "react-bootstrap";
import axios from 'axios';

export default class Home extends React.Component{
    constructor(props){
        super()
        this.state = {show: false, draft_show: false, title:"", overview:"", 
                    thought:"", link:"", tags : [], draft_title: "", draft_link: "", postList: [],
                    yetPostList: [], user_name: "", user_bio : "", }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.title_handleChange = this.title_handleChange.bind(this);
        this.overview_handleChange = this.overview_handleChange.bind(this);
        this.link_handleChange = this.link_handleChange.bind(this);
        this.thought_handleChange = this.thought_handleChange.bind(this);
        this.tags_handleChange = this.tags_handleChange.bind(this);
        this.draft_handleClose = this.draft_handleClose.bind(this);
        this.draft_handleShow = this.draft_handleShow.bind(this);
        this.draft_link_handleChange = this.draft_link_handleChange.bind(this);
        this.draft_title_handleChange = this.draft_title_handleChange.bind(this);
        this.draft_handleSubmit = this.draft_handleSubmit.bind(this);

        const url = "http://localhost:5000/posts/1";
        axios.get(url)
        .then((res) => {
            res.data.forEach((doc) => {
                this.state.postList.push(
                <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true}
                />);
                this.setState({postList : this.state.postList});
            });
        }).catch((error) => {
            console.log(error)
        });
        const yeturl = "http://localhost:5000/wantReads/1";
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
        const userUrl = "http://localhost:5000/users/1";
        axios.get(userUrl).then((res) => {
            this.setState({user_bio : res.data.BIO, user_name : res.data.DisplayName });
        });
    }
    handleClose() {
        this.setState({show: false});
    }
    handleShow() {
        this.setState({show: true});
    }
    draft_handleClose() {
        this.setState({draft_show : false});
    }
    draft_handleShow() {
        this.setState({ draft_show: true});
    }
    handleSubmit(e) {
        const submitUrl = "http://localhost:5000/posts";
        const time = new Date();
        var params = new URLSearchParams();
        params.append("UserId", 1);
        params.append("PostDate", time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate());
        params.append("Title", this.state.title);
        params.append("Overview", this.state.overview);
        params.append("Link", this.state.link);
        params.append("Thought", this.state.thought);
        params.append("Tags", this.state.tags);
        if (this.state.title == "" || this.state.overview == "" || this.state.link == "" || this.state.thought == ""){
            alert("全ての項目を入力して下さい")
        }
        else{
            axios.post(submitUrl, params)
                .then( (response) => {
                    console.log(response);
                  })
                  .catch( (error) => {
                    console.log(error);
                  });
        }
        this.setState({show: false});
    }
    draft_handleSubmit(e) {
        const submitUrl = "http://localhost:5000/wantReads";
        var params = new URLSearchParams();
        params.append("UserId", 1);
        params.append("Title", this.state.draft_title);
        params.append("Link", this.state.draft_link);
        axios.post(submitUrl, params).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err);
        });
        this.setState({draft_show : false})
    }
    title_handleChange(e) {
        this.setState({ title: e.target.value});
    }
    overview_handleChange(e) {
        this.setState({ overview: e.target.value});
    }
    link_handleChange(e) {
        this.setState({ link: e.target.value});
    }
    thought_handleChange(e) {
        this.setState({ thought: e.target.value});
    }
    draft_title_handleChange(e) {
        this.setState({ draft_title: e.target.value});
    }
    draft_link_handleChange(e) {
        this.setState({ draft_link: e.target.value});
    }
    tags_handleChange(e) {
        var input_tags = e.target.value.split("#")
        input_tags.forEach(tag => {
            if (tag.includes(",")){
                tag.replace(",", "")
            }
        });
        this.setState({tags: input_tags});
    }
    render(){
        return (
            <div>
                <Modal  style={{opacity:1}} show={this.state.show} onHide={this.handleClose} 
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header >
                    <Modal.Title>読んだ論文について説明しましょう</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <Form>
                            <Form.Group controlId="formTitile">
                                <Form.Label>その論文のタイトルは?</Form.Label>
                                <Form.Control placeholder="Enter title" onChange={this.title_handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="formOverview">
                                <Form.Label>どんな内容でしたか?</Form.Label>
                                <Form.Control placeholder="overview" onChange={this.overview_handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="formLink">
                                <Form.Label>その論文のリンク</Form.Label>
                                <Form.Control placeholder="http:///www.XXX" onChange={this.link_handleChange}/>
                                <Form.Text className="text-muted">
                                正しいリンクを貼ってください
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formthought">
                                <Form.Label>読んだ感想</Form.Label>
                                <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" onChange={this.thought_handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="formTab">
                                <Form.Label>タブの追加</Form.Label>
                                <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" onChange={this.tags_handleChange}/>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="info" onClick={this.handleClose}>
                                Save Changes
                            </Button>

                        </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="success" type="submit" onClick={this.handleSubmit}>
                                Post
                    </Button>
                    </Modal.Footer>
                </Modal>
                <MyInfo name={this.state.user_name} bio={this.state.user_bio}/>
                    <div className="papers">
                    <CardGroup className = 'm-4' style={{ width: '100vm' }}>
                        <Card.Header style={{ width: '50%' }}><Button variant="info" size="lg" onClick={this.handleShow}>読んだ論文を投稿</Button>
                            <div>
                                {this.state.postList}
                            </div>
                        </Card.Header>
                        <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}><Button variant="secondary" size="lg" onClick={this.draft_handleShow}>気になる論文を投稿</Button>
                            <div>
                                {this.state.yetPostList}
                            </div>
                        </Card.Header>
                    
                    </CardGroup>
                    </div>
                    <Modal  style={{opacity:1}} show={this.state.draft_show} onHide={this.draft_handleClose} 
                        size="lg"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered>
                    <Modal.Header >
                    <Modal.Title>気になる論文のリンクとタイトルを教えてください</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <Form>
                            <Form.Group controlId="formTitile">
                                <Form.Label>その論文のタイトルは?</Form.Label>
                                <Form.Control placeholder="Enter title" onChange={this.draft_title_handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="formLink">
                                <Form.Label>その論文のリンク</Form.Label>
                                <Form.Control placeholder="http:///www.XXX" onChange={this.draft_link_handleChange}/>
                                <Form.Text className="text-muted">
                                正しいリンクを貼ってください
                                </Form.Text>
                            </Form.Group>
                            
                            <Button variant="secondary" onClick={this.draft_handleClose}>
                                Close
                            </Button>
                        </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="success" type="submit" onClick={this.draft_handleSubmit}>
                                Post
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        )
    }
}
