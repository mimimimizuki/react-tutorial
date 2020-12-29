import React, { useEffect, useState } from "react";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { Card, Image ,OverlayTrigger, Tooltip, Dropdown} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import { useAuth0 } from "@auth0/auth0-react";
import { PhotoshopPicker } from "react-color";
const PostDetail = (props) => {
    const [ data, setData ] = useState({user_name:"", user_id:""})
    const [ me, setMe ] = useState(false);
    const [ liked, setLike ] = useState(false);
    const [ like_id, setLikeID ] = useState("");
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
            setData({user_id: res.data.UserId});
        }
        const getData = async (post_id, user_id) => { // postを取得
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
                setData({...data, user_name: res.data.DisplayName})
            }).catch(err => {
                console.log(err)
            });
        }
        const getFav = async (post_id, user_id) => { //そのpostがファボしたものかを確認する
            console.log(data)
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
        
    }, [])

    const handleClick = async () => {
        const token = await getTokenSilently();
        if (!liked){ // add favorite 
            var params = new URLSearchParams();
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
    const handleUpdateClick = async () => {
        const token = await getAccessTokenSilently();
        axios.put("http://localhost:5000/posts",{
            "PostId": data.post_id, 
            "Title" : data.title, 
            "Overview": data.overview,
            "Link": data.link,
            "Thought" : data.thought,
            "Tags" : data.tags,
        }, {
            headers: {
                Authorization: "Bearer "+token,
            }
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
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
    const handleOtherPage = (id) => {
        if (me){
            props.history.push("/")
        }
        else{
            props.history.push("/user?id="+id);
        }
    }
    return (
        <div>
            {isLoading ? <>loading...</>:
            <div>
            <Card >
            {me ? 
                    <div>
                    <Image src="../../images/logo.png"  roundedCircle onClick={() => handleOtherPage(data.user_id)}
                        style={{ height: 50, width: 50}} /><h2 className="user_name" onClick={() => handleOtherPage(data.user_id)}>{data.user_name}</h2>
                    <Dropdown>
                        <Dropdown.Toggle className="detail"variant="dark">more action</Dropdown.Toggle>
                        <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleUpdateClick}>update</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleDeleteClick}>delete</Dropdown.Item>
                        </Dropdown.Menu> 
                    </Dropdown>
                    </div>
                    
                : 
                <div>
                <Image src="../../images/logo2.png"  roundedCircle onClick={() => handleOtherPage(id)}
                    style={{ height: 50, width: 50}} /><h2 className="user_name">{data.user_name}</h2>
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