import React, { useState } from 'react';
import MyInfo from "../components/MyInfo";
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardDeck, Button, Modal, Tabs, Form, Tab, Alert } from "react-bootstrap";
import axios from 'axios';

export default class Home extends React.Component{
    constructor(props){
        super()
        this.state = {show: false, draft_show: false, title:"", overview:"", thought:"", link:"", tags : [] , postList: [], yetPostList: [], user_name: "", user_bio : "", }
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.title_handleChange = this.title_handleChange.bind(this);
        this.overview_handleChange = this.overview_handleChange.bind(this);
        this.link_handleChange = this.link_handleChange.bind(this);
        this.thought_handleChange = this.thought_handleChange.bind(this);
        this.draft_handleClose = this.draft_handleClose.bind(this);
        this.draft_handleShow = this.draft_handleShow.bind(this);
        this.tags_handleChange = this.tags_handleChange.bind(this);

        const url = "http://localhost:5000/posts/";
        axios.get(url)
        .then((res) => {
            res.data.forEach((doc) => {
                this.state.postList.push(
                <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags}
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
                    <YetPosts key={doc.ID} title={doc.Title} link={doc.Link} />
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
        axios.post(submitUrl, data1).then((res) => {
            console.logg(res.data.UserId)
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
                    <CardDeck className = 'm-4' >
                    <Button variant="info" size="sm" onClick={this.handleShow}>読んだ論文を投稿</Button>
                        <Card.Header>読んだ論文
                            <div>
                                {this.state.postList}
                            </div>
                        </Card.Header>
                        <Card.Header>気になる論文
                            <div>
                                {this.state.yetPostList}
                            </div>
                        </Card.Header>
                    <Button variant="secondary" size="sm" onClick={this.draft_handleShow}>気になる論文を投稿</Button>
                    </CardDeck>
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
            </div>
        )
    }
}

// curl -H "origin: http://localhost:8080/" -v "http://localhost:5000/users/1"

// {UserId: 1, 
// PostDate: "2020-12-2", 
// Title: "Gait-based person identification method using shad…or robustness to changes in the walking direction", 
// Overview: "監視カメラで捉えられない体の重なりも考慮して歩行動画から人物推定をする。(シミュレーションのみで実際…量FDFPを導入。他の歩行特徴量よりも学習データとテストデータの撮影角度が異なるときの精度が高い。", 
// Link: "https://robotics.ait.kyushu-u.ac.jp/kurazume/papers/Yumi_WACV2015.pdf", 
// Thought: "シミュレーションのみだったんかーい。"
// }
