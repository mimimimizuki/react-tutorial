import React, { useEffect, useState } from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Image ,OverlayTrigger, Tooltip, Dropdown, Modal, Form, Button} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
const PostDetail = (props) => {
    const [ user_name, setName ] = useState("");
    const [user_id, setUserID] = useState(0);
    const [post_id, setPostID] = useState(0);
    const [ me, setMe ] = useState(false);
    const [ liked, setLike ] = useState(false);
    const [ like_id, setLikeID ] = useState("");
    const [ show, setShow ] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    const [ ooo, setOOO ] = useState("");
    const [ isLoading , setIsLoading ] = useState(false);
    const [title, setTitle] = useState("");
    const [overview, setOverview] = useState("");
    const [link, setLink] = useState("");
    const [thought, setThought] = useState("");
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const setInfo = (res) => {
            setTitle(res.data.Title);
            setLink(res.data.Link);
            setOverview(res.data.Overview);
            setThought(res.data.Thought);
            setTags(res.data.Tags);
            setUserID(res.data.UserId);
            if (res.data.Tags != null) {
                setOOO(res.data.Tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>));
            }
        }
        const getData = async (post_id, user_id) => { // postを取得
            setPostID(Number(post_id));
            const token = await getAccessTokenSilently();
            const url = "http://localhost:5000/posts/"+post_id+"/detail";
            const res = await axios.get(url, {
                headers:{
                    Authorization : "Bearer "+token,
                }
            })
            setInfo(res);
            if (res.data.UserId == user_id){
                setMe(true);
            }
            axios.get("http://localhost:5000/users/"+res.data.UserId).then(res => {
                console.log(res);
                setName(res.data.DisplayName);
            }).catch(err => {
                console.log(err)
            });
        }
        const getFav = async (post_id, user_id) => { //そのpostがファボしたものかを確認する
            const token = await getAccessTokenSilently();
            const getUrl = "http://localhost:5000/favorites/"+user_id;
            axios.get(getUrl, {headers: {
                Authorization: `Bearer ${token}`,
            }}).then((res) => {
                res.data.forEach(doc => {
                    if (doc.ID == post_id){
                        setLike(true)
                    }
                });
            }).catch(err => {
                console.log(err)
            });
            console.log("this post is written by "+user_id)
            setIsLoading(false);
        }
        const query = new URLSearchParams(props.location.search);
        const post_id = query.get('id');
        const getSub = async (user) => {
            const token = await getAccessTokenSilently();
            setIsLoading(true);
            const sub = await user.sub;
            const res = await axios.get("http://localhost:5000/users/"+sub+"/auth", {
                headers: {
                    Authorization: "Bearer "+token,
                }
            });
            getFav(post_id, res.data.ID);
            getData(post_id, res.data.ID);
            return res.ID
        }
        getSub(user);
        if (tags != null) {
            setOOO(tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>));
        }
        console.log(post_id)
    }, [])

    const handleClick = async () => {
        const token = await getTokenSilently();
        if (!liked){ // add favorite 
            params.append("PostId", post_id);
            params.append("UserId", 1);
            axios.post("http://localhost:5000/favorites", params, {headers: {
                Authorization: `Bearer ${token}`,
            }})
            .then(response => {
                setLikeID(response.data.ID)
            }).catch(err => {
                console.log(err);
            });
            setLike(true);
        } else { //delete favorite
            var params = new FormData();
            fetch('http://localhost:5000/favorites/'+like_id,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${token}`,
            }
            }).then(response => {
                console.log(response);
            }).catch(err => {
                console.log(err);
            });
            setLike(false);
        }
    }
    const handleUpdateClick = async (e) => {
        e.persist();
        e.preventDefault();
        const query = new URLSearchParams(props.location.search);
        const time = new Date();
        const token = await getAccessTokenSilently();
        var tagArr = new Array();
        console.log(e.target)
        e.target.formTag.value.split(",").forEach(tag => {
            tag = tag.replace("#", "")
            tagArr.push(tag)
        });
        axios.put("http://localhost:5000/posts", { 
            "UserId": user_id,
            "Title" : e.target.formTitle.value, 
            "PostDate" : time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate(),
            "Overview": e.target.formOverview.value,
            "Link": e.target.formLink.value,
            "Thought" : e.target.formThought.value,
            "ID": post_id,
            "Tags" : tagArr,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        props.history.push("/")
    }


    const handleDeleteClick = async () => {
        const token = await getAccessTokenSilently();
        axios.delete("http://localhost:5000/posts/"+post_id+"/remove", {
            headers: {
                Authorization: "Bearer "+token,
            }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
        props.history.push("/");
    }
    const handleOtherPage = (user_id) => {
        console.log("here")
        if (user_id == 0){
            props.history.push("/")
        }
        else{
            props.history.push("/user?id="+user_id);
        }
    }

    const UpdateModal = (props) => {
        const handleChange= (e) => {
            document.getElementsByName(e.target.name)[0].value = e.target.value;
        }
        return (
            <Modal  {...props} style={{opacity:1}}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
            <Form onSubmit={(e) => handleUpdateClick(e)}>
            <Modal.Header >
            <Modal.Title>読んだ論文について説明しましょう</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Group controlId="formTitle">
                        <Form.Label>その論文のタイトルは?</Form.Label>
                        <Form.Control placeholder="Enter title" name="title" type="text" defaultValue={title} onChange={handleChange} />
                    </Form.Group>
    
                    <Form.Group controlId="formOverview">
                        <Form.Label>どんな内容でしたか?</Form.Label>
                        <Form.Control placeholder="overview" name="overview" defaultValue={overview} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formLink">
                        <Form.Label>その論文のリンク</Form.Label>
                        <Form.Control placeholder="http:///www.XXX" name="link" defaultValue={link} onChange={handleChange} />
                        <Form.Text className="text-muted">
                        正しいリンクを貼ってください
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formThought">
                        <Form.Label>読んだ感想</Form.Label>
                        <Form.Control placeholder="すごく難しかった。何ページ目がわからなかったので誰か教えて" name="thought" defaultValue={thought} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="formTag">
                        <Form.Label>タグの追加</Form.Label>
                        <Form.Control placeholder="#有機化学, #古典力学, #音声認識のように#をつけて最後はカンマで区切る" name="tags" defaultValue={tags} onChange={handleChange} />
                    </Form.Group>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                
                </div>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="success" type="submit">
                        Update
            </Button>
            </Modal.Footer>
            </Form>
        </Modal>
        )
    }
    return (
        <div>
            {isLoading ? <>loading...</>:
            <div>
                {me ? <UpdateModal show={show} onHide={() => setShow(false)} /> : <></>}
                
            <Card >
            {me ? 
                    <div>
                    <Image src="../../images/logo.png"  roundedCircle onClick={() => handleOtherPage(0)}
                        style={{ height: 50, width: 50}} /><h2 className="user_name" onClick={() => handleOtherPage(0)}>{user_name}</h2>
                    <Dropdown>
                        <Dropdown.Toggle className="detail"variant="dark">more action</Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setShow(true)}>update</Dropdown.Item>
                        <Dropdown.Item onClick={handleDeleteClick}>delete</Dropdown.Item>
                        </Dropdown.Menu> 
                    </Dropdown>
                    </div>
                    
                : 
                <div>
                <Image src="../../images/logo2.png"  roundedCircle onClick={() => handleOtherPage(user_id)}
                    style={{ height: 50, width: 50}} /><h2 className="user_name">{user_name}</h2>
                </div>
            }
                <Card.Body  id="post">
                    <Card.Title >{title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{overview}</Card.Subtitle>
                    <Card.Text>
                    {thought}
                    </Card.Text>
                    {ooo}
                    <br></br>
                    <Card.Link href={link}>
                        {link}
                    </Card.Link>
                    <br></br>
                </Card.Body>
                <div>
                {liked ? 
                    <BsFillHeartFill className="heart" color="#e57373" size="30px"  onClick={() => handleClick}/>
                    : 
                    <OverlayTrigger overlay={<Tooltip id="tooltip-like">like!</Tooltip>}>
                    <BsHeart className="heart" size="30px" onClick={() => handleClick}/>
                    </OverlayTrigger>
                    
                }

                <OverlayTrigger overlay={<Tooltip id="tooltip-reply">reply this post</Tooltip>}>
                <BsFillReplyFill size="30px" className="reply" color="dimgray"/>
                </OverlayTrigger>
                </div>
            </Card>
            </div>
            }
        </div>
        );
} 

export default withRouter(PostDetail);