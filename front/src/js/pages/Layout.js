import React from "react";
import AuthNav from "../components/AuthNav";
import Navi from '../components/Navi';
export default class Layout extends React.Component {
  constructor() {
    super();
  }
  render() {
    
    return (
        <div>
            <Navi />
            <AuthNav />
            {this.props.children}
        </div>
    );
  }
}
