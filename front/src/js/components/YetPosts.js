import React, { useState } from 'react';
import { Card, Dropdown, Modal, Button, Form } from "react-bootstrap";
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';
const YetPosts = (props) => {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState(props.title);
    const [overview, setOverview] = useState(props.overview);
    const [link, setLink] = useState(props.link);
    const [thought, setThought] = useState(props.thought);
    const [tags, setTags] = useState(props.tags);
    const [ooo, setOOO] = useState("");
    const { getAccessTokenSilently } = useAuth0();
    const handleDeleteClick = async () => {
        const token = await getAccessTokenSilently();
        const res = await axios.delete("http://localhost:5000/wantReads/"+props.id+"/remove", { headers : {
                Authorization : "Bearer "+token, 
            }
        });
        console.log(res);
        location.reload();
    }
    const handleUpdateClick = async (e) => {
        const token = await getAccessTokenSilently();
        const res = await axios.post("http://localhost:5000/posts",{
            "Title" : e.target.formTitle.value, 
            "Overview": e.target.formOverview.value,
            "Link": e.target.formLink.value,
            "Thought" : e.target.formThought.value,
            "Tags" : tags,
        }, { headers: {
            Authorization: "Bearer "+token,
        }});
        console.log(res);
        const deleteRes = await axios.delete("http://localhost:5000/wantReads/"+props.id, { headers : {
            Authorization : "Bearer "+token, 
        }
        });
        console.log(deleteRes);
    }
    const handleChange = (event) => {
        switch (event.target.name) {
            case 'title':
                setTitle(event.target.value);
                break;
            case 'overview':
                setOverview(event.target.value);
                break;
            case 'link':
                setLink(event.target.value);
                break;
            case 'thought':
                setThought(event.target.value);
                break;
            case 'tags':
                setTags(event.target.value);
            default:
                console.log('key not found');
        }
    }
    const draftonSubmit = () => {
        const submitUrl = "http://localhost:5000/drafts";
        var params = new URLSearchParams();
        if (tags != ""){
            var tagArr = new Array();
            if (tags.includes(",")){
                tagArr = tags.split(",")
            } else{
                tagArr = tags.split(" ");
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
        params.append("Title", title);
        params.append("Overview", overview);
        params.append("Link", link);
        params.append("Thought", thought);
        console.log(params.getAll("Tags"))

        if (this.state.draft_click){
            var result = confirm("すでに下書きが存在します、上書きしますか？");
            if (!result){
                alert("この下書きを削除します");
                return
            }
            else{ //update draft
                axios.put("http://localhost:5000/drafts/1",
                {
                    "UserId":1,
                    "Title": title,
                    "Overview": overview, 
                    "Link": link,
                    "Thought": thought,
                    "Tags":params.getAll("Tags"),
                },
                {headers: {
                    Authorization: `Bearer ${token}`,
                }
                }).then(res =>{
                    console.log(res);
                }).catch(err =>{
                    console.log(err);
                });
                setShow(false)
                return
            }
        }
        if (title == "" && overview == "" && link == "" && thought == "" && tags == []){
            alert("いずれかの項目は入力してください")
        }
        else {
            axios.post(submitUrl, params, {headers: {
                Authorization: `Bearer ${token}`,
            }})
                .then( (response) => {
                    console.log(response);
                })
                .catch( (error) => {
                console.log(error);
                });
        }
        this.setState({show: false});
    }


    const ModalPost = (props) => {
        return (
            <Modal  {...props} style={{opacity:1}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
            <Form onSubmit={handleUpdateClick}>
            <Modal.Header >
            <Modal.Title>読んだ論文について説明しましょう</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Group controlId="formTitile">
                        <Form.Label>その論文のタイトルは?</Form.Label>
                        <Form.Control placeholder="Enter title" onChange={handleChange} defaultValue={title} name="title" />
                    </Form.Group>
    
                    <Form.Group controlId="formOverview">
                        <Form.Label>どんな内容でしたか?</Form.Label>
                        <Form.Control placeholder="overview" onChange={handleChange} defaultValue={overview} name="overview" />
                    </Form.Group>
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" onChange={handleChange} defaultValue={link} name="link" />
                        <Form.Text className="text-muted">
                        正しいリンクを貼ってください
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formthought">
                        <Form.Label>読んだ感想</Form.Label>
                        <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" onChange={handleChange} defaultValue={thought} name="thought" />
                    </Form.Group>
                    <Form.Group controlId="formTab">
                        <Form.Label>タブの追加</Form.Label>
                        <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" onChange={handleChange} defaultValue={tags} name="tags" />
                    </Form.Group>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="info" onClick={draftonSubmit}>
                        Save Changes
                    </Button>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" type="submit">
                        Post
            </Button>
            </Modal.Footer>
            </Form>
        </Modal>
        )
    }
    return (
        <div>
            <ModalPost show={show} onHide={() => setShow(false)} />
            <Card>
            <Dropdown>
                <Dropdown.Toggle className="detail"variant="secondary">more action</Dropdown.Toggle>
                <Dropdown.Menu>
                <Dropdown.Item onClick={() => setShow(true)}>読んだ！</Dropdown.Item>
                <Dropdown.Item onClick={handleDeleteClick}>もう読まない</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <Card.Body>
                <Card.Title>{props.title}
                </Card.Title>
                <Card.Link href={props.link}>
                {props.link}
                </Card.Link>
            </Card.Body>
            </Card>
        </div>
    )
}

export default YetPosts;