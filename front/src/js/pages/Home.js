import React, { useState } from 'react';
import MyInfo from "../components/MyInfo";
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardDeck, Button, Modal, Tabs, Form, Tab } from "react-bootstrap";

export default class Home extends React.Component{
    constructor(props){
        super()
        this.state = {show: false, title:"", overview:"", thought:"", link:""}
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
    }
    handleClose() {
        this.setState({show: false});
    }
    handleShow(flag) {
        if (flag==true) {
            this.setState({show: true});
        }
        else{
            this.setState({show: true});
        }
    }
    formSubmit(e) {
        this.setState({data:e.target.value})
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
                                <Form.Control placeholder="Enter title" />
                            </Form.Group>

                            <Form.Group controlId="formOverview">
                                <Form.Label>どんな内容でしたか?</Form.Label>
                                <Form.Control placeholder="overview" />
                            </Form.Group>
                            <Form.Group controlId="formLink">
                                <Form.Label>その論文のリンク</Form.Label>
                                <Form.Control placeholder="http:///www.XXX" />
                                <Form.Text className="text-muted">
                                正しいリンクを貼ってください
                                </Form.Text>
                            </Form.Group>
                            <Form.Group controlId="formthought">
                                <Form.Label>読んだ感想</Form.Label>
                                <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" />
                            </Form.Group>
                            <Form.Group controlId="formTab">
                                <Form.Label>タブの追加</Form.Label>
                                <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" />
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
                    <Button variant="success" type="submit" onClick={this.handleClose}>
                                Post
                    </Button>
                    </Modal.Footer>
                </Modal>
                <MyInfo name="mizuki" bio="情報工学"/>
                    <div className="papers">
                    <CardDeck className = 'm-4' >
                    <Button variant="info" size="sm" onClick={this.handleShow}>読んだ論文を投稿</Button>
                        <Card.Header>読んだ論文
                        <Posts title="a" overview="本物にはエントロピー大、偽物にはエントロピー小にする" link="http://www.aaa" thought="わからんかった、誰か知見ください"/>
                        <Posts title="i" overview="SVMなどのマージン最大、最小化の理論をGANに応用したもの。" link="http://www.iii" thought="これは自分の研究にも応用できそう"/>
                        <Posts title="u" overview="" link="http://www.uuu" thought="GANに３つ目の識別器を導入したのが新規性があると思った"/>
                        <Posts title="e" overview="" link="http://www.eee" thought=""/>
                        </Card.Header>
                        <Card.Header>気になる論文
                        <YetPosts title="a" link="http://www.aaa" />
                        <YetPosts title="i" link="http://www.iii" />
                        <YetPosts title="u" link="http://www.uuu" />
                        <YetPosts title="e" link="http://www.eee" />
                        </Card.Header>
                    <Button variant="secondary" size="sm" onClick={this.handleShow}>読みたい論文を投稿</Button>
                    </CardDeck>
                </div>
            </div>
        )
    }
}