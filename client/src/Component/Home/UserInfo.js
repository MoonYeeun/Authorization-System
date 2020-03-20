import React, {Component} from 'react';
import '../Layout/Layout.css'
import axios from "axios";

//사용자 정보 보여주는 페이지 
class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content : '', 
      user_id : '',
      user_name : ''
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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.logged !== this.props.logged) {
      this.handleUserInfo(nextProps.logged);
    }
    return true;
  }
  
  handleUserInfo = (status) => {
    if(status){
      this.setState({
        content: 'Hi !'
      });
    } else {
      this.setState({
        content: 'Not Found',
        user_id: '',
        user_name: ''
      });
    }
  }
  // 리프레시 토큰 검사 후 새로운 access token 발급
  requestAccessToken = async (url) => {
    let body = {
      refresh_token : localStorage.getItem('refresh_token')
    }
    return new Promise((resolve, reject) => {
      axios.post(url, body, {headers :this.setHeaders()})
      .then(res => {
        if(res.data.state === 'success') { //새롭게 발급받은 access token 저장 
          window.localStorage.setItem('access_token', res.data.message);
          resolve();
        }
      })
      .catch(error => {
        console.log("errr "+ error);
        alert('유효하지 않은 접근입니다.');
        reject();
      });
    });
  }
  // user 목록 불러오기
  getUserList= async () => {
    axios.get('/users/userInfo', {headers :this.setHeaders()})
    .then(async res => {
      if(res.data.state === 'success') {
        this.setState ({
            content: 'Hi !',
            user_id : res.data.message.user_id,
            user_name : res.data.message.user_name
        })
      } else {
        this.handleUserInfo(false);
        await this.requestAccessToken('/users/verifyToken');
        this.getUserList();
      }
    })
    .catch(error => {
        console.log('error 발생 ' + error);
        window.location.href="/";
    });  
  }

  componentDidMount() {
    this.handleUserInfo(this.props.logged);
    this.getUserList();
  }
  
  render() {
    return (
      <div className="content">
        <h2 className="info_title">{this.state.content}</h2>
        <h3 className="info_content">{this.state.user_name}</h3>
      </div>
    );
  }
}
export default UserInfo;