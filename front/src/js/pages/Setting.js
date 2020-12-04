import React from "react";
import { TwitterPicker } from 'react-color';
export default class Setting extends React.Component{
    constructor(props) {
        super(props);
        this.state = {backgroundColor: "white"}
    }
    handleChange(color){
        this.setState({ backgroundColor: color.hex });
    };
    render() {
        return(
            <h1 style={{backgroundColor:this.state.backgroundColor}}>
                this is setting page 
                you can update your bio (photos )
                and background color and navbar color
                <TwitterPicker color={ this.state.backgroundColor }
                                onChange={ this.handleChange.bind(this) }/>
            </h1>
        )
    }
}