import React, { Component } from 'react';
import '../Layout/Layout.css'
import GetUserList from './GetUserList';
import axios from "axios";

class AdminPage1 extends Component{
  constructor(props) {
    super(props);
    this.state = {
        content : '',
        user_list: ''
    }
  }

  setHeaders = () => {
    let headers = {
      'authorization' : localStorage.getItem('access_token'),
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
    return headers;
  }

  handleAdmin= (status) => {
    if(status === '1'){ // admin 일 때
        axios.get('/users/admin', {headers :this.setHeaders()})
        .then(res => {
        if(res.data.state === 'success') {
            this.setState ({
            content : 'Hi Administer',
            user_list: <GetUserList user_list={res.data.message}/>
            });
        }})
        .catch(error => {
            console.log('error 발생');
            window.location.href="/";
        });
    }
    else {
        this.setState ({ // 아닐 때
            content: '접근 권한이 없습니다.'
        });
    }    
  }

  handleLogCheck = (status) => {
    if(status === true) {
        this.handleAdmin(this.props.admin);
    } else {
        alert('유효하지 않은 접근입니다.');
        window.location.href="/";
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.logged !== this.props.logged) {
        this.handleLogCheck(nextProps.logged);
    }
    return true;
  }

  componentDidMount() {
    this.handleLogCheck(this.props.logged);
  }

  render() {
    console.log('admin 여부 '+this.props.admin);
    console.log(this.state.user_list);
    console.log('logged 여부'+ this.props.logged);
    return (
      <>
      <div className="content">
      <p className="admin_title">{this.state.content}</p>
      {this.state.user_list}
      </div>
      </>
    );  
  }    
}
export default AdminPage1;