import React from "react";
import Navi from '../components/Navi';
export default class Layout extends React.Component {
  constructor() {
    super();
  }
  render() {
    
    return (
        <div style={{backgroundColor:"#d9e3f0"}}>
            <Navi />
            {this.props.children}
        </div>
    );
  }
}
