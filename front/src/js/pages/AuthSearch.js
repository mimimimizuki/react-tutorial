import React, { useState } from 'react';
import { Form, Button, FormControl } from "react-bootstrap";
import { useForm } from 'react-hook-form';
import { withRouter } from 'react-router-dom';
import Posts from "../components/Posts";
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const Search = ()  => {
    const [post, setPost] = useState([]);
    const { register, handleSubmit, errors} = useForm();
    const { getAccessTokenSilently, user } = useAuth0();

    const onSubmit = async (data) => {
            const token = await getAccessTokenSilently();
            const sub = await user.sub;
            const res = await axios.get("http://localhost:5000/users/"+sub+"/auth", {
                headers: {
                    Authorization : "Bearer "+token,
                }
            });
            const user_id = res.data.ID;
            const result = new Array();
            console.log(data.tags)
            var tagArr = new Array();
            if (data.tags.includes(",")){
                tagArr = data.tags.split(",")
            } else{
                tagArr = data.tags.split(" ");
            }
            const searchUrl = "http://localhost:5000/search"
            var params = new URLSearchParams();
            for (let i = 0; i < tagArr.length; i ++) {
                if (tagArr[i].includes("#")){
                    tagArr[i] = tagArr[i].replace("#", "");
                }
                params.append("tags", tagArr[i])
            }
            console.log(params.getAll("tags"))
            axios.get(searchUrl, {params: params}).then(res => {
                console.log(res);
                if (res.data.length == 0){
                    alert("お探しの投稿はありません.")
                    setPost([])
                    return
                }
                else{
                    res.data.forEach(doc => {
                        var me = false;
                        if (doc.UserId == user_id){
                            me = true;
                        }
                        else{
                            me = false;
                        }
                        result.push(<Posts key={doc.ID}  title={doc.Title} overview={doc.Overview} link={doc.Link} thought={doc.Thought} tags={doc.Tags} id={doc.ID} me={me} authorized={true}/>);
                    });
                    setPost(result);
                }
            }).catch(err => {
                console.log(err);
            });
    };
    return (
        <div>
            <Form inline onSubmit={handleSubmit(onSubmit)}>
                    <FormControl type="text" placeholder="調べたい論文のキーワード" className="mr-sm-2" id="search" ref={register({ required: true})} name="tags"/>
                    <Button variant="outline-info" type="submit" size="lg">Search</Button>
                    {errors.title && <span>検索内容は必須です</span>}
            </Form>
            <div>
                {post}
            </div>
        </div>
    )
}

export default withRouter(Search)