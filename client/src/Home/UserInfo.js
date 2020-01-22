import React, {Component} from 'react';
import '../Layout/Layout.css'
//import axios from "axios";

class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content : ''
    }
  }

  shouldComponentUpdate(nextProps, nextState) {

    console.log("next log :" + nextProps.logged);
    console.log("now props.log: " + this.props.logged);
    if (nextProps.logged !== this.props.logged) {
      this.handleUserInfo(nextProps.logged);
    }
    return true;
  }
  handleUserInfo = (logged) => {
    console.log('user '+this.props.logged);
    if(logged){
      this.setState({
        content: 'Hi !'
      });
    } else {
      this.setState({
        content: 'Not Found'
      });
    }
  }
  componentDidMount() {
    this.handleUserInfo(this.props.logged);
  }
  render() {
    return (
      <div className="content">
        <h2 className="info_title">{this.state.content}</h2>
      </div>
    );
  }
}
export default UserInfo;