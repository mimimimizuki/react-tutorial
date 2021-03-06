import React, { useState, useEffect } from "react";
import { CardGroup, Card, Button } from "react-bootstrap";
import axios from 'axios';
import Posts from '../components/Posts';
import YetPosts from "../components/YetPosts";
import MyInfo from '../components/MyInfo';
import { withRouter } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
const User = (props) => {
    const [ data , setData ] = useState({user_name:"", user_bio:"", following:"0", follower:"0"});
    const [ posts, setPosts ] = useState([]);
    const [ yets, setYetPosts ] = useState([]);
    const { getAccessTokenSilently, user } = useAuth0();
    const [ isLoading, setIsLoading ] = useState(false);
    useEffect(() => {
        const getUserData = async (user_id) => {
            await setIsLoading(true)
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/users/" + user_id, {
                headers: {
                    Authorization : "Bearer " + token
                }
            }).catch(err => {
                console.log(err)
                props.history.push("/404");
            });
            setData({user_name: res.data.DisplayName, user_bio: res.data.BIO, following: res.data.FollowingNum, follower: res.data.FollowerNum});
            await fetchPost(user_id);
            await fetchYetPost(user_id);
        }
        const fetchPost = async (user_id) => {
            const token = await getAccessTokenSilently();
            const url = "http://localhost:5000/posts/"+user_id;
            axios.get(url, {
                headers : {
                    Authorization: "Bearer "+token,
                }
            }).then((res) => {
                res.data.forEach((doc) => {
                    posts.push({
                        "post" : doc,
                        "me" : false,
                        "authorized" : true,
                    });
                    // postList.push(
                    // <Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={false} authorized={true}
                    // />);
                    setPosts(posts);
                });
            }).catch((error) => {
                console.log(error)
            });
        }
        const fetchYetPost = async (user_id) => {
            const token = await getAccessTokenSilently();
            const yeturl = "http://localhost:5000/wantReads/"+user_id;
            const res = await axios.get(yeturl, {
                headers: {
                    Authorization: "Bearer "+token,
                    'Content-Type': 'application/json',
                }
            }).catch((error) => {
                console.log(error)
            });
            res.data.forEach((doc) => {
                yets.push({
                    "projects" : doc,
                    "me" : false
                });
                setYetPosts(yets);
                console.log(yets)
            })
            setIsLoading(false);
        }
        const user_id = parseInt(props.match.params.id)
        // const query = new URLSearchParams(props.location.search);
        // const user_id = query.get('id');
        getUserData(user_id);
    }, [])
    const handleFollow = async () => {
        const token = await getAccessTokenSilently();
        const Sub = await user.sub;
        const subRes = await axios.get("http://localhost:5000/users/"+Sub+"/auth", {
            headers: {
                Authorization : "Bearer "+token,
            }
        })
        const following = subRes.data.ID;
        addFollow(following);
    }
    const addFollow = async (following_id) => {
        const token = await getAccessTokenSilently();
        const follower = parseInt(props.match.params.id);
        var params = new URLSearchParams();
        params.append('following', following_id);
        params.append('follower', follower);
        const postRes = await axios.post("http://localhost:5000/follow", params, {
            headers: {
                Authorization : `Bearer ${token}`,
            }
        });
        console.log(postRes)
    }
    return (
        <div>
            {isLoading ? <>loading...</>
            :
            <div>
                <Button color="green" size="lg" onClick={() => handleFollow()}>Follow </Button>
                <MyInfo name={data.user_name} bio={data.user_bio} following={data.following} follower={data.follower} other="yes"/>
                <CardGroup className = 'm-4' style={{ width: '100vm' }}>
                        <Card.Header style={{ width: '50%' }}>
                            {posts.length > 0 ? (
                                posts.map((post, i) => {
                                    return (
                                        <Posts key={post.post.ID} title={post.post.Title} overview={post.post.Overview} link={post.post.Link} thought={post.post.Thought} tags={post.post.Tags} id={post.post.ID} me={post.me} authorized={post.authorized} index={i} />
                                    );
                                })
                            ) : (
                                "no post"
                            )
                            }
                        </Card.Header>
                        <Card.Header style={{ width: '50%', position:'relative', right: '0px' }}>
                                {
                                yets.length > 0 ? (
                                    yets.map((projects, i) => {
                                        return(
                                            <div>
                                            <YetPosts key={i} title={projects.projects.Title} link={projects.projects.Link} id={projects.projects.ID} me={projects.me} />
                                            </div>
                                        );
                                    })
                                )
                                :
                                "no post"
                                // yetpostList.length == 0 ? "no post"
                                // :
                                // <div>{yetpostList}</div>
                                }
                        </Card.Header>
                </CardGroup>
            </div>
        }
        </div>
    );
}


export default withRouter(User);