import React, { useEffect, useState } from "react";
import { Button, FormControl, Form } from "react-bootstrap";
import { ChromePicker } from 'react-color';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import  { useAuth0 } from '@auth0/auth0-react';

const Setting = () => {
    const { getAccessTokenSilently } = useAuth0();
    const [backgroundColor, setBackColor ] = useState({"h":250, "s":0, "l":1, "a":1 });
    const [navColor, setNavColor ] = useState("black");

    const [bio, setBIO] = useState("");
    const [name, setName ] = useState("");
    const [ changeFlg, setFlg ] = useState(false);
    useEffect(() => {
        const getInfo =async () => {
            const token = await getAccessTokenSilently();
            axios.get("http://localhost:5000/users/1", {
                headers: {
                    Authorization : "Bearer " + token,
                }
            }).then(res => {
                setBIO(res.data.BIO);
                setName(res.data.DisplayName);
            });   
        }
        getInfo();
    })
    const handleChange = (event) => {
        switch (event.target.name) {
            case 'bio':
                setName(event.target.value);
                break;
            case 'name':
                setBIO(event.target.value);
                break;
            default:
                console.log('key not found');
        }
    };
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
    const handleSubmit = () => {
        const modify = {
            "BIO" : bio,
            "DisplayName" : name,
        };
        axios.put("http://localhost:5000/users/1", modify, {
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
        <Form style={{textAlign:"center"}} onSubmit={() => handleSubmit} >
            <FormControl type="text" onChange={handleChange} value={bio} className="bio" ></FormControl>
            <FormControl type="text" onChange={handleChange} value={name} className="name" ></FormControl>
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
