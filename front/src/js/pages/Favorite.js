import React, {useState,useEffect} from "react";
import Posts from '../components/Posts'
import { Card , Container} from "react-bootstrap";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Favorite = () => {
    const [ postList, setPosts ] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { getAccessTokenSilently, user } = useAuth0();
    useEffect( () => {
        console.log(user.sub)
        const getPosts = async (user_id) => {
            const token = await getAccessTokenSilently();
            const res = await axios.get("http://localhost:5000/favorites/"+user_id, {
                headers: {
                    Authorization: "Bearer " + token,
                }
            });
            res.data.forEach((doc) => {
                var flg = false
                if (doc.UserId == user_id){
                    flg = true
                }
                postList.push(<Posts key={doc.ID} title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={flg} authorized={true}
                    />);
                setPosts(postList);
            });
        }
        const getSub = async (user) => {
            setIsLoading(true);
            const token = await getAccessTokenSilently();
            const sub = await user.sub;
            const res = await axios.get("http://localhost:5000/users/"+sub+"/auth",{
                headers:{
                    Authorization : "Bearer "+token,
                }
            });
            const post = await getPosts(res.data.ID)
            console.log(post)
            setIsLoading(false);
            return res.ID
        }
        const user_id = getSub(user);
        console.log("res "+user_id)
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