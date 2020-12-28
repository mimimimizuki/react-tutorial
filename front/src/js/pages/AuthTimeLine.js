import React, { useEffect, useRef, useState } from 'react';
import { Container } from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Posts from '../components/Posts';

const TimeLine = () => {
    const [ postList, setPosts ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    useEffect( () => {
        async function getPosts(user_id) {
            const token = getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/posts", {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            res.data.forEach((doc) => {
                console.log(doc)
                if (doc.UserId == user_id){
                    postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true} authorized={true}/>)
                    setPosts(postList);
                } else {
                    postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={false} authorized={true}
                        />);
                    setPosts(postList);
                }
                
            });
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
            const post = await getPosts(res.data.ID)
            console.log(post)
            setIsLoading(false);
            return res.ID
        }
        getSub(user);
    }, []);
    
    return(
        <div>
        {isLoading ? (<>Loading...</>) :
            (<Container >
            <div className="timeline">
                {postList}
            </div>
            </Container>)
        }
        </div>
    )
}

export default TimeLine