import React, {useState,useEffect} from "react";
import Posts from '../components/Posts'
import { Card , Container} from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Favorite = () => {
    console.log("render")
    const [ postList, setPosts ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently } = useAuth0();
    useEffect( () => {
        console.log("caled")
        const getPosts = async () => {
            setIsLoading(true);
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/favorites/1", {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            res.data.forEach((doc) => {
                var flg = false
                if (doc.UserId == 1){
                    flg = true
                }
                postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={flg} authorized={true}
                    />);
                setPosts(postList);
            });
            setIsLoading(false);
        }
        getPosts();
    },[]);
    
    return(
        <div>
        {isLoading ? (<>Loading...</>) : 
                (<Container >
                    <div className="favorites">
                        {postList}
                    </div>
                </Container>)
        }
        </div>
    )
}

export default Favorite