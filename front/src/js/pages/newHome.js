import React, { useEffect, useState } from 'react';
import MyInfo from '../components/MyInfo';
import Posts from "../components/Posts";
import YetPosts from "../components/YetPosts";
import { Card, CardGroup, Button, Modal, Form} from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const newHome = () => {
    const [show, setShow] = useState(false);
    const [wantReadShow, setWantReadShow] = useState(false);
    const [postList, setPosts] = useState([]);
    const [yetPostList, setYetPosts] = useState([]);
    const [userInfo, setUser] = useState({DisplayName: "", BIO:"", ID: ""});
    const [ isLoading, setIsLoading] = useState(false);
    const [ draft_id, setDraftID] = useState("");
    const [ draft_click, setDraftClick ] = useState(false);
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
    const { getAccessTokenSilently, user } = useAuth0();
    useEffect(() => {
        const getPosts = async (user_id) => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/posts/"+user_id, {
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
        const getYetPosts = async (user_id) => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/wantReads/"+user_id, {headers: {
                Authorization: `Bearer ${token}`,
            }});
            res.data.forEach((doc) => {
                yetPostList.push(<YetPosts key={doc.ID} title={doc.Title} link={doc.Link} id={doc.ID}/>
                    );
                setYetPosts(yetPostList);
            });
            return (yetPostList)
        }
        const getSub = async (user) => {
            setIsLoading(true);
            const token = await getAccessTokenSilently();
            const sub = await user.sub;
            const res = await axios.get("http://localhost:5000/users/"+sub+"/auth", {
                headers: {
                    Authorization : "Bearer "+token,
                }
            });
            setUser(res.data);
            console.log(userInfo)
            const post = await getPosts(res.data.ID)
            const yetpost = await getYetPosts(res.data.ID)
            console.log(post+yetpost)
            setIsLoading(false);
            return res.ID
        }
        const allset = async () => {
            const user_id = await getSub(user);
            console.log("res"+user_id)
        }
        allset();
    }, []);
    
    const wantonSubmit = async () => {
        const token = await getAccessTokenSilently();
        const submitUrl = "http://localhost:5000/wantReads";
        var params = new URLSearchParams();
        params.append("UserId", userInfo.ID);
        const wantread_title = await document.getElementsByClassName("wantread_title")[0].value;
        const wantread_link = await document.getElementsByClassName("wantread_link")[0].value;
        params.append("Title", wantread_title);
        params.append("Link", wantread_link);
        axios.post(submitUrl, params, {headers: {
            Authorization: `Bearer ${token}`,
        }}).then((res) => {
            console.log(res)
        }).catch(err => {
            console.log(err);
        });
        setWantReadShow(false);
        location.reload();
    }

    const onSubmit = async (e) => {
        e.persist();
        e.preventDefault();
        console.log("clicked")
        const token = await getAccessTokenSilently();
        const submitUrl = "http://localhost:5000/posts";
        const time = new Date();
        var params = new URLSearchParams();
        console.log(e.target.formLink)
        const title = e.target.formTitle.value;
        const overview = e.target.formOverview.value;
        const link = e.target.formLink.value;
        const thought = e.target.formThought.value;
        var tagArr = new Array();
        e.target.formTag.value.split(",").forEach(tag => {
            tag = tag.replace("#", "")
            tagArr.push(tag)
        });
        console.log(tagArr);
        params.append("UserId", userInfo.ID);
        params.append("PostDate", time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate());
        params.append("Title", title);
        params.append("Overview", overview);
        params.append("Link", link);
        params.append("Thought", thought);
        params.append("Tags", tagArr);
        if (title == "" || overview == "" || link == "" || thought == ""){
            alert("全ての項目を入力して下さい")
        }
        else{
            if(draft_click){
                var delete_draft = await confirm("下書きを削除しますか?");
                axios.post(submitUrl, params, {
                    headers : {
                        Authorization : "Bearer " + token,
                    }
                })
                .then( (response) => {
                    console.log(response);
                })
                .catch( (error) => {
                    console.log(error);
                });
                if (delete_draft){
                    axios.delete("http://localhost:5000/drafts/"+draft_id, {headers: {
                        Authorization: `Bearer ${token}`,
                    }}).then(res =>{
                        console.log(res);
                    }).catch(err => {
                        console.log(err);
                    });
                }
            }
            else {
                if (tagArr == ""){
                    return
                }
                axios.post(submitUrl, params, {
                    headers : {
                        Authorization : "Bearer " + token,
                    }
                })
                .then( (response) => {
                    console.log(response);
                })
                .catch( (error) => {
                    console.log(error);
                });
            }

        }
        setShow(false);
    }

    const handleSeeDrafts = async (e) => {
        const token = await getAccessTokenSilently();
        axios.get("http://localhost:5000/drafts/"+userInfo.ID, {
            headers: {
            Authorization: `Bearer ${token}`,
        }}).then(res => {
            console.log(res);
            var tagArr = new Array();
            if (res.data.Tags.length > 0){
                res.data.Tags.forEach(tag => {
                    tagArr.push("#"+tag);
                });
                console.log(tagArr);
            }
            setDraftID(res.data.ID);
            setDraftClick(true);
            document.getElementsByName("title")[0].value = res.data.Title;
            document.getElementsByName("overview")[0].value = res.data.Overview;
            document.getElementsByName("link")[0].value = res.data.Link;
            document.getElementsByName("thought")[0].value = res.data.Thought;
            document.getElementsByName("tags")[0].value = tagArr;
            console.log("setted"+document.getElementsByName("tags")[0].value)
            alert(document.getElementsByName("tags")[0].value)
        }).catch(err => {
            console.log(err)
        });
        e.preventDefault();
    }
    const draftonSubmit = async () => {
        const submitUrl = "http://localhost:5000/drafts";
        var params = new URLSearchParams();
        const title = await document.getElementsByName("title")[0];
        const overview = await document.getElementsByName("overview")[0];
        const link = await document.getElementsByName("link")[0];
        const thought = await document.getElementsByName("thought")[0];
        const tags = await document.getElementsByName("tags")[0];
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
        params.append("UserId", userInfo.ID)
        params.append("Title", title);
        params.append("Overview", overview);
        params.append("Link", link);
        params.append("Thought", thought);
        console.log(params.getAll("Tags"))

        if (draft_click){
            var result = confirm("すでに下書きが存在します、上書きしますか？");
            if (!result){
                alert("この下書きを削除します");
                return
            }
            else{ //update draft
                axios.put("http://localhost:5000/drafts/"+userInfo.ID,
                {
                    "UserId":userInfo.ID,
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
        setShow(false);
    }
    const ModalPost = (props) => {
        return (
            <Modal  {...props} style={{opacity:1}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
            <Form onSubmit={(e)=> onSubmit(e)}>
            <Modal.Header >
            <Modal.Title>読んだ論文について説明しましょう</Modal.Title><Button variant="dark" onClick={handleSeeDrafts}>see drafts</Button>
            </Modal.Header>
            <Modal.Body>
                <div>
                
                    <Form.Group controlId="formTitle">
                        <Form.Label>その論文のタイトルは?</Form.Label>
                        <Form.Control placeholder="Enter title" name="title" />
                    </Form.Group>
    
                    <Form.Group controlId="formOverview">
                        <Form.Label>どんな内容でしたか?</Form.Label>
                        <Form.Control placeholder="overview" name="overview" />
                    </Form.Group>
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" name="link" />
                        <Form.Text className="text-muted">
                        正しいリンクを貼ってください
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formThought">
                        <Form.Label>読んだ感想</Form.Label>
                        <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" name="thought" />
                    </Form.Group>
                    <Form.Group controlId="formTag">
                        <Form.Label>タグの追加</Form.Label>
                        <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" name="tags" />
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
            <Button variant="success" type="submit"> Post </Button>
            </Modal.Footer>
            </Form>
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
                        <Form.Control placeholder="Enter title" className="wantread_title" name="wantread_title" />
                    </Form.Group>
    
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" className="wantread_link" name="wantread_link" />
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
    if (isLoading) {
        return <>Loading...</>
    }
    return (
        <div>
        <ModalPost show={show} onHide={() => setShow(false)} />
        <MyInfo name={userInfo.DisplayName} bio={userInfo.BIO} following="10" follower="10"/>
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