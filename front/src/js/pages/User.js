import React, { useState } from "react";
import { CardGroup, Card } from "react-bootstrap";
import axios from 'axios';
import MyInfo from '../components/MyInfo';
import { withRouter } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
const User = (props) => {
    const [ data , setData ] = useState({user_name:"", user_bio:""});
    const [ postList, setPosts ] = useState([]);
    const [ yetpostList, setYetPosts ] = useState([]);
    const { getAccessTokenSilently } = useAuth0();
    useEffect(() => {
        const token = getAccessTokenSilently();
        getUserData = async (user_id) => {
            axios.get("http://localhost:5000/users/" + user_id, {
                headers: {
                    Authorization : "Bearer " + token
                }
            }).then(res => {
                setData({user_name: res.data.DisplayName, user_bio: res.data.BIO});
            }).catch(err => {
                console.log(err);
                props.history.push("/404");
            });
        }
        const fetchPost = async (user_id) => {
            const url = "http://localhost:5000/posts/"+user_id;
            axios.get(url, {
                headers : {
                    Authorization: "Bearer "+token,
                }
            }).then((res) => {
                res.data.forEach((doc) => {
                    postList.push(
                    <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true}
                    />);
                    setPosts(postList)
                });
            }).catch((error) => {
                console.log(error)
            });
        }
        const fetchYetPost = async (user_id) => {
            const yeturl = "http://localhost:5000/wantReads/"+user_id;
            axios.get(yeturl, {
                headers: {
                    Authorization: "Bearer "+token,
                }
            }).then((res) => {
                res.data.forEach((doc) => {
                    yetpostList.push(
                        <YetPosts key={doc.ID} title={doc.Title} link={doc.Link} id={doc.ID}/>
                    );
                    setYetPosts(yetpostList);
                });
            }).catch((error) => {
                console.log(error)
            });
        }
        const query = new URLSearchParams(this.props.location.search);
        const user_id = query.get('id');
        getUserData(user_id);
        fetchPost(user_id);
        fetchYetPost(user_id);
    })
    return (
        <div>
            <MyInfo name={data.user_name} bio={data.user_bio} following="10" follower="10" other="yes"/>
            <CardGroup className = 'm-4' style={{ width: '100vm' }}>
                    <Card.Header style={{ width: '50%' }}>
                            {
                            postList.length == 0 ? "no post"
                             :
                             <div>{postList}</div>
                            }
                    </Card.Header>
                    <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}>
                            {
                            yetpostList.length == 0 ? "no post"
                             :
                             <div>{yetpostList}</div>
                            }
                    </Card.Header>
            </CardGroup>
        </div>
    );
}


export default withRouter(User);