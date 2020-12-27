import React, { useEffect, useRef, useState } from 'react';
import { Container } from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import Posts from '../components/Posts';

const TimeLine = () => {
    console.log("render")
    const [ postList, setPosts ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    useEffect( () => {
        console.log("caled")
        async function getPosts() {
            setIsLoading(true)
            const token = getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/posts", {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            res.data.forEach((doc) => {
                console.log(doc)
                if (doc.UserId == 1){
                    postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={true} authorized={true}/>)
                    setPosts(postList);
                } else {
                    postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={false} authorized={true}
                        />);
                    setPosts(postList);
                }
                
            });
            setIsLoading(false);
        }
        getPosts();
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