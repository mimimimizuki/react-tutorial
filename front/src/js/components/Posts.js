import React, { useEffect, useState } from 'react';
import { Card, Image ,OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
const Posts = (props) => {
    const [liked, setLike] = useState(false);
    const [liked_id, setLikeId] = useState("");
    const [me, setMe] = useState(props.me);
    const {id} = props;
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    const [ooo, setOOO] = useState("");
    useEffect(() => {
        const getFav = async () => {
            setIsLoading(true);
            const token = await getAccessTokenSilently();
            const Sub = await user.sub;
            const subRes = await axios.get("http://localhost:5000/users/"+Sub+"/auth", {
                headers: {
                    Authorization : "Bearer "+token,
                }
            })
            const user_id = subRes.data.ID;
            const res = await axios.get("http://localhost:5000/favorites/"+user_id, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            const ok = await res.data.forEach(doc => {
                if (doc.ID == props.id){
                    setLike(true);
                    setLikeId(doc.ID)
                }
            });
            if (props.me){
                setMe(true);
            }
            setIsLoading(false)
        }
        if (props.tags != null) {
            setOOO(props.tags.map((tag, i) => <p key={i} className="tags">#{tag}</p>));
        }
        if (props.authorized) {
            getFav();
        }
    }, []);
    const handleClick = async (id) => {
        const token = await getAccessTokenSilently();
        if (!liked){ // add favorite 
            var params = new URLSearchParams();
            params.append("PostId", id);
            params.append("UserId", 1);
            const response = await axios.post("http://localhost:5000/favorites", params, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setLikeId(response.data);
            setLike(true);
        } else { //delete favorite
            const response = await fetch('http://localhost:5000/favorites/'+liked_id,{
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    Authorization : "Bearer " + token,
                  }
            });
            console.log(response);
            setLike(false);
        }
    }
    const handleOtherPage = (id) => {
        if (me){
            props.history.push("/")
        }
        else{
            props.history.push("/user?id="+id);
        }
    }
    const handleSeePost = (id) => {
        props.history.push("/posts?id="+id);
    }
    return (
        <div>
            {isLoading ? <>Loading...</> : 
                    (<Card >
                    {me ? <Image src="../../images/logo.png"  roundedCircle onClick={() => handleOtherPage(id)}
                        style={{ height: 50, width: 50}} /> : 
                        <Image src="../../images/logo2.png"  roundedCircle onClick={() => handleOtherPage(id)}
                        style={{ height: 50, width: 50}} />
                    }
                        <Card.Body  id="post">
                            <Card.Title onClick={() => handleSeePost(id)}>{props.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{props.overview}</Card.Subtitle>
                            <Card.Text>
                            {props.thought}
                            </Card.Text>
                            {ooo}
                            <br></br>
                            <Card.Link href={props.link}>
                                {props.link}
                            </Card.Link>
                            <br></br>
                        </Card.Body>
                        {props.authorized &&
                            liked ? 
                            <BsFillHeartFill className="heart" color="#e57373" size="30px"  onClick={() => handleClick}/>
                                : 
                                <OverlayTrigger overlay={<Tooltip id="tooltip-like">like!</Tooltip>}>
                                <BsHeart className="heart" size="30px" onClick={() => handleClick}/>
                            </OverlayTrigger>
                        }
                        
                        <OverlayTrigger overlay={<Tooltip id="tooltip-reply">reply this post</Tooltip>}>
                        <BsFillReplyFill size="30px" className="reply" color="dimgray"/>
                        </OverlayTrigger>
                    </Card>)
            }
        </div>
    )
}

export default withRouter(Posts);