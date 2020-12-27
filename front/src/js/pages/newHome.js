import React, { useEffect, useState } from 'react';
import MyInfo from '../components/MyInfo';
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardGroup, Button, Modal, Form} from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const newHome = () => {
    console.log("render")
    const [show, setShow] = useState(false);
    const [wantReadShow, setWantReadShow] = useState(false);
    const [postList, setPosts] = useState([]);
    const [yetPostList, setYetPosts] = useState([]);
    const [user, setUser] = useState([]);
    const [title, setTitle] = useState("");
    const [overview, setOverview] = useState("");
    const [link, setLink] = useState("");
    const [thought, setThought] = useState("");
    const [tags, setTags] = useState("");
    const [wantread_title, setWantreadTitle] = useState("");
    const [wantread_link, setWantreadLink] = useState("");
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    const { getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        console.log("useEffect")
        const getPosts = async () => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/posts/1", {
                headers: {
                Authorization: "Bearer " + token ,
            }});
            res.data.forEach((doc) => {
                postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true} authorized={true}
                    />);
                setPosts(postList);
            });
            return (postList)
        }
        const getYetPosts = async () => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/wantReads/1", {headers: {
                Authorization: `Bearer ${token}`,
            }});
            res.data.forEach((doc) => {
                yetPostList.push(<YetPosts key={doc.ID} title={doc.Title} link={doc.Link} id={doc.ID}/>
                    );
                setYetPosts(yetPostList);
            });
            return (yetPostList)
        }
        const getUser = async () => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/users/1", {headers: {
                Authorization: `Bearer ${token}`,
            }});
            setUser(res.data);
            return "ok"
        }
        const allset = async () => {
            const post = await getPosts();
            const yetpost = await getYetPosts();
            const getuse = await getUser();
            console.log(post+yetpost+getuse)
        }
        allset()
        
    }, []);
    
    const wantonSubmit = async (data) => {
        const token = await getAccessTokenSilently();
        const submitUrl = "http://localhost:5000/wantReads";
        var params = new URLSearchParams();
        params.append("UserId", 1);
        params.append("Title", data.wantread_title);
        params.append("Link", data.wantread_link);
        axios.post(submitUrl, params, {headers: {
            Authorization: `Bearer ${token}`,
        }}).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err);
        });
        setWantReadShow(false);
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
    };
    const handleWantreadChange = (event) => {
        switch (event.target.name) {
            case 'wantread_title':
                setWantreadTitle(event.target.value)
                break;
            case 'wantread_link':
                setWantreadLink(event.target.value)
                break;
            default:
                console.log('key not found');
        }
    }
    const onSubmit = () => {
        const submitUrl = "http://localhost:5000/posts";
        const time = new Date();
        var params = new URLSearchParams();
        params.append("UserId", 1);
        params.append("PostDate", time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate());
        params.append("Title", title);
        params.append("Overview", overview);
        params.append("Link", link);
        params.append("Thought", thought);
        params.append("Tags", tags);
        if (title == "" || overview == "" || link == "" || thought == ""){
            alert("全ての項目を入力して下さい")
        }
        else{
            if (this.state.draft_click){
                var delete_draft = confirm("下書きを削除しますか?");
                axios.post(submitUrl, params)
                .then( (response) => {
                    console.log(response);
                  })
                  .catch( (error) => {
                    console.log(error);
                  });
                if (delete_draft){
                    axios.delete("http://localhost:5000/drafts/"+this.state.draft_id, {headers: {
                        Authorization: `Bearer ${token}`,
                    }}).then(res =>{
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }

        }
        setShow(false);
    }
    const draftonSubmit = (data) => {
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
            <Modal.Header >
            <Modal.Title>読んだ論文について説明しましょう</Modal.Title><Button variant="dark" onClick={() => handleSeeDrafts}>see drafts</Button>
            </Modal.Header>
            <Modal.Body>
                <div>
                <Form>
                    <Form.Group controlId="formTitile">
                        <Form.Label>その論文のタイトルは?</Form.Label>
                        <Form.Control placeholder="Enter title" onChange={handleChange} value={title} />
                    </Form.Group>
    
                    <Form.Group controlId="formOverview">
                        <Form.Label>どんな内容でしたか?</Form.Label>
                        <Form.Control placeholder="overview" onChange={handleChange} value={overview} />
                    </Form.Group>
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" onChange={handleChange} value={link} />
                        <Form.Text className="text-muted">
                        正しいリンクを貼ってください
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formthought">
                        <Form.Label>読んだ感想</Form.Label>
                        <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" onChange={handleChange} value={thought} />
                    </Form.Group>
                    <Form.Group controlId="formTab">
                        <Form.Label>タブの追加</Form.Label>
                        <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" onChange={handleChange} value={tags} />
                    </Form.Group>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="info" onClick={draftonSubmit}>
                        Save Changes
                    </Button>
    
                </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" type="submit" onClick={onSubmit}>
                        Post
            </Button>
            </Modal.Footer>
        </Modal>
        )
    }
    
    const ModalYetPost = (props) => {
        return (
            <Modal  {...props} style={{opacity:1}}
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
                        <Form.Control placeholder="Enter title" value={wantread_title} onChange={handleWantreadChange} />
                    </Form.Group>
    
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" value={wantread_link} onChange={handleWantreadChange} />
                        <Form.Text className="text-muted">
                        正しいリンクを貼ってください
                        </Form.Text>
                    </Form.Group>
                    
                    <Button variant="secondary" onClick={() => setWantReadShow(false)}>
                        Close
                    </Button>
                </Form>
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" type="submit" onClick={wantonSubmit}>
                        Post
            </Button>
            </Modal.Footer>
        </Modal>
        )
    }
    return (
        <div>
        <ModalPost show={show} onHide={() => setShow(false)} />
        <MyInfo name={user.DisplayName} bio={user.BIO} following="10" follower="10"/>
            <div className="papers">
            <CardGroup className = 'm-4' style={{ width: '100vm' }}>
                <Card.Header style={{ width: '50%' }}><Button variant="info" size="lg" onClick={() => setShow(true)}>読んだ論文を投稿</Button>
                    <div>
                        {postList}
                    </div>
                </Card.Header>
                <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}><Button variant="secondary" size="lg" onClick={() => setWantReadShow(true)}>気になる論文を投稿</Button>
                    <div>
                        {yetPostList}
                    </div>
                </Card.Header>
            </CardGroup>
            </div>
        <ModalYetPost onHide={() => setWantReadShow(false)} show={wantReadShow} />
    </div>
    )
}

export default newHome