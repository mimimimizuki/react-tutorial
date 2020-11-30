import React from "react";
import Navi from '../components/Navi';
export default class Layout extends React.Component {
  constructor() {
    super();
    this.state = {title : 'Welcome'};
  }
  render() {
    
    return (
        <div>
            <Navi />
            {this.props.children}
        </div>
    );
  }
}
