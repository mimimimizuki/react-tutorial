import React from "react";

export default class User extends React.Component{
    render() {
        return (
            <div>
                <Image src="../../images/logo.png"  thumbnail 
                style={{ height: 100, width: 100, textAlign:"center"}} />
                <h1>oher users</h1>
                <p>infomatics</p>
                <div>
                    <p>〇〇following</p><p>〇〇follower</p>
                </div>
            </div>
        );
    }
}