import React, { Component } from 'react';
import '../Layout/Layout.css'
import GetUserList from './GetUserList';
import axios from "axios";

class AdminPage1 extends Component{
  constructor(props) {
    super(props);
    this.state = {
        content : '접근 권한이 없습니다.',
        user_list: ''
    }
  }

  // 관리자 페이지 목록 불러오기 
  getAdminList = async () => {
    const { requestAccessToken, setHeaders } = this.props;

    axios.get('/users/admin', {headers : setHeaders()})
    .then(async res => {
      if(res.data.state === 'success') {
        this.setState ({
        content : 'Hi Administer',
        user_list: <GetUserList user_list={res.data.message}/>
        });
      } else {
        await requestAccessToken('/users/verifyToken');
        this.handleAdmin(this.props.admin);
      }}) 
    .catch(error => {
      window.location.href="/";
    });
  }

  handleAdmin= (status) => {
    const { requestAccessToken } = this.props;
    // admin 일 때
    if(status === '1'){ 
        this.getAdminList();
    } 
    // 아닐 때
    else { 
      requestAccessToken('/users/verifyToken')
      .catch(error => {
        window.location.href="/";
      });
    } 
  }

  handleLogCheck = (status) => {
    if(status) {
      this.handleAdmin(this.props.admin);
    } else {
      window.location.href="/";
    }
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