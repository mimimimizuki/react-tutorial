import React, { useEffect, useState } from "react";
import { Button, FormControl, Form } from "react-bootstrap";
import { ChromePicker } from 'react-color';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import  { useAuth0 } from '@auth0/auth0-react';
import { useForm } from "react-hook-form";

const Setting = () => {
    const { getAccessTokenSilently, user } = useAuth0();
    const [backgroundColor, setBackColor ] = useState({"h":250, "s":0, "l":1, "a":1 });
    const [navColor, setNavColor ] = useState("black");
    const {register, handleSubmit} = useForm();
    const [bio, setBIO] = useState("");
    const [name, setName ] = useState("");
    const [ user_id, setUserID] = useState("");
    const [ changeFlg, setFlg ] = useState(false);
    useEffect(() => {
        const getInfo = async () => {
            const token = await getAccessTokenSilently();
            const Sub = await user.sub;
            axios.get("http://localhost:5000/users/"+Sub+"/auth", {
                headers: {
                    Authorization : "Bearer " + token,
                }
            }).then(res => {
                setBIO(res.data.BIO);
                setName(res.data.DisplayName);
                setUserID(res.data.ID);
            });   
        }
        getInfo();
    })
    const handleBackGroundChange = (color) => {
        const newColor = {
            "h":color.hsl.h, 
            "s":color.hsl.s,
            "l":color.hsl.l,
            "a":color.rgb.a
        }
        setBackColor(newColor);
        document.body.style.backgroundColor = "rgb("+color.rgb.r+","+color.rgb.g+","+color.rgb.b+","+color.rgb.a + ")";
    }
    const handleNavChange = (color) => {
        const newColor = {
            "h":color.hsl.h, 
            "s":color.hsl.s,
            "l":color.hsl.l,
            "a":color.rgb.a
        }
        setNavColor(newColor);
        document.getElementById("navColor").style.backgroundColor = "rgb("+color.rgb.r+","+color.rgb.g+","+color.rgb.b+","+color.rgb.a + ")";
    }
    const onSubmit = (data) => {
        const modify = {
            "BIO" : data.bio,
            "DisplayName" : data.name,
        };
        axios.put("http://localhost:5000/users/"+user_id, modify, {
            headers:{
                Authorization : "Bearer : " + token,
            }
        }).then(res => {
            console.log(res);
            setFlg(true);
        }).catch(err => {
            console.log(err);
        });
    }
    return(
        <div>
        <h1 style={{textAlign:"center"}}>
            change your bio
        </h1>
        <Form style={{textAlign:"center"}} onSubmit={handleSubmit(onSubmit)} >
            <FormControl type="text" value={bio} name="bio" ref={register} ></FormControl>
            <FormControl type="text" value={name} name="name" ref={register} ></FormControl>
            <Button variant="info" size="lg"　type="submit">
                    change!
            </Button>
        </Form>
        <h1 style={{textAlign:"center"}}>change back ground color </h1>
        <ChromePicker color={ backgroundColor } style={{left:"50%"}}
                            onChangeComplete={handleBackGroundChange}/>
        <h1 style={{textAlign:"center"}}>change navbar back ground color </h1>
        <ChromePicker color={navColor} style={{textAlign:"center"}}
                            onChangeComplete={ handleNavChange }/>
        {changeFlg ? <Redirect to="/"/> : <></>}
        </div>
        
    )
}

export default Setting
