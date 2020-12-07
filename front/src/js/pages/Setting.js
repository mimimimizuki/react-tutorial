import React from "react";
import { Button, FormControl, Form } from "react-bootstrap";
import { ChromePicker } from 'react-color';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
export default class Setting extends React.Component{
    constructor(props) {
        super(props);
        this.state = {backgroundColor: {"h":250, "s":0, "l":1, "a":1 }, navColor: "black",  bio: "", name : "", flg : false} 
    }
    componentDidMount(e){
        axios.get("http://localhost:5000/users/1").then(res => {
            this.setState({ bio : res.data.BIO, name:res.data.DisplayName});
        });
    }
    handleChange(color){
        const newColor = {
            "h":color.hsl.h, 
            "s":color.hsl.s,
            "l":color.hsl.l,
            "a":color.rgb.a
        }
        this.setState({ backgroundColor: newColor});
        document.body.style.backgroundColor = "rgb("+color.rgb.r+","+color.rgb.g+","+color.rgb.b+","+color.rgb.a + ")";
        console.log(this.state.backgroundColor)
    }
    handleNavChange(color) {
        const newColor = {
            "h":color.hsl.h, 
            "s":color.hsl.s,
            "l":color.hsl.l,
            "a":color.rgb.a
        }
        this.setState({ navColor : newColor});
        document.getElementById("navColor").style.backgroundColor = "rgb("+color.rgb.r+","+color.rgb.g+","+color.rgb.b+","+color.rgb.a + ")";
        console.log(this.state.navColor);
    }
    handleBIOChange(e) {
        this.setState({ bio : e.target.value});
    }
    handleNameChange(e) {
        this.setState({ name : e.target.value});
    }
    handleSubmit(e) {
        e.preventDefault()
        const modify = {
            "BIO" : this.state.bio,
            "DisplayName" : this.state.name,
        };
        axios.put("http://localhost:5000/users/1", modify).then(res => {
            console.log(res);
            this.setState({ flg : true})
        }).catch(err => {
            console.log(err);
        });
    }
    render() {
        return(
            <div>
            <h1 style={{textAlign:"center"}}>
                change your bio
            </h1>
            <Form style={{textAlign:"center"}} onSubmit={this.handleSubmit.bind(this)} >
                <FormControl type="text" onChange={this.handleBIOChange.bind(this)} value={this.state.bio} className="mr-sm-2" ></FormControl>
                <FormControl type="text" onChange={this.handleNameChange.bind(this)} value={this.state.name} className="mr-sm-2" ></FormControl>
                <Button variant="info" size="lg"　type="submit">
                        change!
                </Button>
            </Form>
            <ChromePicker color={ this.state.backgroundColor }
                                onChangeComplete={ this.handleChange.bind(this) }/>
            <ChromePicker color={this.state.navColor}
                                onChangeComplete={ this.handleNavChange.bind(this) }/>
            {this.state.flg ? <Redirect to="/"/> : <></>}
            </div>
            
        )
    }
}