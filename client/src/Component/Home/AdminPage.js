import React, { Component } from 'react';
import '../Layout/Layout.css'
import GetUserList from './GetUserList';
import axios from "axios";

export const verifyToken = async url => {
  let headers = {
    'authorization': localStorage.getItem('access_token'),
    'Accept' : 'application/json',
    'Content-Type': 'application/json'
  };
  return axios.get(url, {headers})
};
export const verifyRefreshToken = url => {
  let body = {
    refresh_token : localStorage.getItem('refresh_token')
  };
  let headers = {
    'authorization': localStorage.getItem('access_token'),
    'Accept' : 'application/json',
    'Content-Type': 'application/json'
  };
  return axios.post(url, body, {headers})
};

class AdminPage extends Component{
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
  // 리프레시 토큰 검사 후 새로운 access token 발급
  requestAccessToken = (url) => {
    let body = {
      refresh_token : localStorage.getItem('refresh_token')
    }
    axios.post(url, body, {headers :this.setHeaders()})
    .then(res => {
      if(res.data.state === 'success') { //새롭게 발급받은 access token 저장 
        this.setState ({
          content : 'Hi Administer',
          user_list: <GetUserList user_list={res.data.message.user_list}/>
        })
        window.localStorage.setItem('access_token', res.data.message.access_token);
      }
    })
    .catch(error => {
      alert('유효하지 않은 접근입니다.');
      window.location.href="/";
    });
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
      }
      //access token 만료된 경우
      if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
        this.requestAccessToken('/users/admin');
      } else { // access 토큰 잘못된경우 
        console.log(res.data.message);
        alert('유효하지 않은 접근입니다.');
        window.location.href="/";
      }
    })
    .catch(error => {
      console.log('error 발생');
      window.location.href="/";
    });
  }
    else {
      this.setState({ // 아닐 때
        content: '접근 권한이 없습니다.'
      });
    }
  }

  componentDidMount() {
    this.handleAdmin(this.props.admin);  
  }

  render() {
    console.log('admin 여부 '+this.props.admin);
    console.log(this.state.user_list);
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
export default AdminPage;