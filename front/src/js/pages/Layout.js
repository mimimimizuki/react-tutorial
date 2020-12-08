import React from "react";
import Navi from '../components/Navi';
export default class Layout extends React.Component {
  constructor() {
    super();
  }
  render() {
    
    return (
        <div>
            <Navi />
            <div id="test">
            {this.props.children}
            </div>
        </div>
    );
  }
}
