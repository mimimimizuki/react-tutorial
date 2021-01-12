import React, { useEffect, useState } from 'react';
import { Card, Image ,OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsFillReplyFill, BsFillHeartFill, BsHeart } from "react-icons/bs";
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
const Posts = (props) => {
    const [liked, setLike] = useState(false);
    const [me, setMe] = useState(props.me);
    const {id} = props;
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    const [user_id ,setUserID] = useState(0);
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
            setUserID(Number(subRes.data.ID))
            const user_id = subRes.data.ID;
            const res = await axios.get("http://localhost:5000/favorites/"+user_id, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            const ok = await res.data.forEach(doc => {
                if (doc.ID == props.id){
                    setLike(true);
                }
            });
            if (props.me){
                setMe(true);
            }
            console.log("id is", id)
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
        var params = new URLSearchParams();
        params.append("PostId", (id));
        params.append("UserId", String(user_id));
        if (!liked){ // add favorite 
            const response = await axios.post("http://localhost:5000/favorites", params, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setLike(true);
        } else { //delete favorite
            const response = await axios.delete('http://localhost:5000/favoritesRemove/'+id+"/"+String(user_id), {
                headers: {
                    Authorization : `Bearer ${token}`,
                }
            });
            console.log(response);
            setLike(false);
        }
    }
    const handleSeePost = (id) => {
        props.history.push("/posts?id="+id);
    }
    return (
        <div>
            {isLoading ? <>Loading...</> : 
                    (<Card >
                    {me ? <Image src="../../images/logo.png"  roundedCircle
                        style={{ height: 50, width: 50}} /> : 
                        <Image src="../../images/logo2.png"  roundedCircle
                        style={{ height: 50, width: 50}} />
                    }
                        <Card.Body  id="post">
                            {props.authorized ? <Card.Title onClick={() => handleSeePost(id)}>{props.title}</Card.Title>
                            :
                            <Card.Title>{props.title}</Card.Title>
                            }
                            
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
                            (liked ? 
                            <BsFillHeartFill className="heart" color="#e57373" size="30px"  onClick={() => handleClick(id)}/>
                                : 
                                <OverlayTrigger overlay={<Tooltip id="tooltip-like">like!</Tooltip>}>
                                <BsHeart className="heart" size="30px" onClick={() => handleClick(id)}/>
                            </OverlayTrigger>)
                        }
                        {props.authorized && 
                            <OverlayTrigger overlay={<Tooltip id="tooltip-reply">reply this post</Tooltip>}>
                            <BsFillReplyFill size="30px" className="reply" color="dimgray"/>
                            </OverlayTrigger>
                        }
                        
                    </Card>)
            }
        </div>
    )
}

export default withRouter(Posts);