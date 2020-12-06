import React from "react";
import { Image, Col, Row, Container } from "react-bootstrap"
export default class MyInfo extends React.Component{
    render() {
        return(
            <div className="mypage">
                {this.props.other == "yes" ? <Image src="../../images/logo2.png"  thumbnail 
                style={{ height: 100, width: 100, textAlign:"center"}} />
                :
                <Image src="../../images/logo.png"  thumbnail 
                style={{ height: 100, width: 100, textAlign:"center"}} />
            }
                <h1>{this.props.name}</h1>
                <p>{this.props.bio}</p>
                <div>
                <p>{this.props.following}  following</p><p>{this.props.follower}  follower</p>
                </div>
            </div>
        )
    }
}