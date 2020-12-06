import React, { useState } from 'react';
import MyInfo from "../components/MyInfo";
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardGroup, Button, Modal, Form} from "react-bootstrap";
import axios from 'axios';

export default class Home extends React.Component{
    constructor(props){
        super()
        this.state = {show: false, wantread_show: false, title:"", overview:"", 
                    thought:"", link:"", tags : [], wantread_title: "", wantread_link: "", postList: [],
                    yetPostList: [], user_name: "", user_bio : "", draft_exist: false}
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.title_handleChange = this.title_handleChange.bind(this);
        this.overview_handleChange = this.overview_handleChange.bind(this);
        this.link_handleChange = this.link_handleChange.bind(this);
        this.thought_handleChange = this.thought_handleChange.bind(this);
        this.tags_handleChange = this.tags_handleChange.bind(this);
        this.wantread_handleClose = this.wantread_handleClose.bind(this);
        this.wantread_handleShow = this.wantread_handleShow.bind(this);
        this.wantread_link_handleChange = this.wantread_link_handleChange.bind(this);
        this.wantread_title_handleChange = this.wantread_title_handleChange.bind(this);
        this.wantread_handleSubmit = this.wantread_handleSubmit.bind(this);

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
        axios.get("http://localhost:5000/drafts/1").then(res => {
            console.log(res);
            if (res.data.length > 0){
                this.setState({ draft_exist : true});
            }
        }).catch(err => {
            console.log(err);
        })
    }
    handleClose() {
        this.setState({show: false});
    }
    handleShow() {
        this.setState({show: true});
    }
    wantread_handleClose() {
        this.setState({wantread_show : false});
    }
    wantread_handleShow() {
        this.setState({ wantread_show: true});
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
    wantread_handleSubmit(e) {
        const submitUrl = "http://localhost:5000/wantReads";
        var params = new URLSearchParams();
        params.append("UserId", 1);
        params.append("Title", this.state.wantread_title);
        params.append("Link", this.state.wantread_link);
        axios.post(submitUrl, params).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err);
        });
        this.setState({wantread_show : false})
    }
    draft_handleSubmit(e) {
        if (this.state.draft_exist){
            alert("すでに下書きが存在します、そちらを書いてからにしましょう");
            return
        }
        const submitUrl = "http://localhost:5000/drafts";
        var params = new URLSearchParams();
        if (this.state.tags != ""){
            var tagArr = new Array();
            if (this.state.tags.includes(",")){
                tagArr = this.state.tags.split(",")
            } else{
                tagArr = this.state.tags.split(" ");
            }
            tagArr.forEach(element => {
                if (element.includes("#")){
                    element = element.replace("#", "")
                } 
                element = element.trim();
                params.append("Tags", element);
            });
        } else {
            params.append("Tags", "")
        }
        params.append("UserId", 1)
        params.append("Title", this.state.title);
        params.append("Overview", this.state.overview);
        params.append("Link", this.state.link);
        params.append("Thought", this.state.thought);
        console.log(params.getAll("Tags"))
        if (this.state.title == "" && this.state.overview == "" && this.state.link == "" && this.state.thought == "" && this.state.tags == []){
            alert("いずれかの項目は入力してください")
        }
        else {
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
    handleSeeDrafts(e) {
        axios.get("http://localhost:5000/drafts/1").then(res => {
            console.log(res);
            var tagArr = new Array();
            if (res.data[0].Tags.length > 0){
                res.data[0].Tags.forEach(tag => {
                    tagArr.push("#"+tag);
                });
            }
            this.setState({ title:res.data[0].Title, overview:res.data[0].Overview,  link: res.data[0].Link,
                            thought : res.data[0].Thought, tags:tagArr});
        }).catch(err => {
            console.log(err);
        })
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
    wantread_title_handleChange(e) {
        this.setState({ wantread_title: e.target.value});
    }
    wantread_link_handleChange(e) {
        this.setState({ wantread_link: e.target.value});
    }
    tags_handleChange(e) {
        this.setState({tags: e.target.value});
    }
    render(){
        return (
            <div>
                <Modal  style={{opacity:1}} show={this.state.show} onHide={this.handleClose} 
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                    <Modal.Header >
                    <Modal.Title>読んだ論文について説明しましょう</Modal.Title><Button variant="dark" onClick={this.handleSeeDrafts.bind(this)}>see drafts</Button>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                        <Form>
                            <Form.Group controlId="formTitile">
                                <Form.Label>その論文のタイトルは?</Form.Label>
                                <Form.Control placeholder="Enter title" onChange={this.title_handleChange} value={this.state.title}/>
                            </Form.Group>

                            <Form.Group controlId="formOverview">
                                <Form.Label>どんな内容でしたか?</Form.Label>
                                <Form.Control placeholder="overview" onChange={this.overview_handleChange} value={this.state.overview}/>
                            </Form.Group>
                            <Form.Group controlId="formLink">
                                <Form.Label>その論文のリンク</Form.Label>
                                <Form.Control placeholder="http:///www.XXX" onChange={this.link_handleChange} value={this.state.link}/>
                                <Form.Text className="text-muted">
                                正しいリンクを貼ってください
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formthought">
                                <Form.Label>読んだ感想</Form.Label>
                                <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" onChange={this.thought_handleChange} value={this.state.thought}/>
                            </Form.Group>
                            <Form.Group controlId="formTab">
                                <Form.Label>タブの追加</Form.Label>
                                <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" onChange={this.tags_handleChange} value={this.state.tags}/>
                            </Form.Group>
                            <Button variant="secondary" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="info" onClick={this.draft_handleSubmit.bind(this)}>
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
                        <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}><Button variant="secondary" size="lg" onClick={this.wantread_handleShow}>気になる論文を投稿</Button>
                            <div>
                                {this.state.yetPostList}
                            </div>
                        </Card.Header>
                    
                    </CardGroup>
                    </div>
                    <Modal  style={{opacity:1}} show={this.state.wantread_show} onHide={this.wantread_handleClose} 
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
                                <Form.Control placeholder="Enter title" onChange={this.wantread_title_handleChange}/>
                            </Form.Group>

                            <Form.Group controlId="formLink">
                                <Form.Label>その論文のリンク</Form.Label>
                                <Form.Control placeholder="http:///www.XXX" onChange={this.wantread_link_handleChange}/>
                                <Form.Text className="text-muted">
                                正しいリンクを貼ってください
                                </Form.Text>
                            </Form.Group>
                            
                            <Button variant="secondary" onClick={this.wantread_handleClose}>
                                Close
                            </Button>
                        </Form>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="success" type="submit" onClick={this.wantread_handleSubmit}>
                                Post
                    </Button>
                    </Modal.Footer>
                </Modal>
                
            </div>
        )
    }
}
