import React, {Component} from 'react';
import '../Layout/Layout.css'
import axios from "axios";

export const verifyToken = (url, headers) => {
  return axios.get(url, {headers})
};
export const verifyRefreshToken = (url, headers) => {
  let body = {
    refresh_token : localStorage.getItem('refresh_token')
  }
  return axios.post(url, body, {headers})
};
class UserInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      status: 'false',
      content : '', 
      user_id : '',
      user_name : '',
      headers : {
        'authorization': localStorage.getItem('access_token'),
        'Accept' : 'application/json',
        'Content-Type': 'application/json'
      }
    }
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
  componentDidMount() {
    console.log('did mount');
    verifyToken('/users/userInfo', this.state.headers)
    .then(res => {
      //access token 만료된 경우
      if(res.data.state === 'fail' && res.data.message === 'jwt expired'){

        verifyRefreshToken('/users/userInfo', this.state.headers) // refresh token 서버로 보낸다. 
        .then(res => {
          if(res.status === '200') { //새롭게 발급받은 access token 저장 
            this.setState ({
                status : true,
                user_id : res.data.message.user_id,
                user_name : res.data.message.user_name
            })
            window.localStorage.setItem('access_token', res.data.message.access_token);
          }
        })
        .catch(error => {
          alert('유효하지 않은 접근입니다.');
          window.location.href="/";
        });
      } else if(res.data.state === 'fail' && res.data.message !== 'jwt expired') {
        console.log(res.data.message);
        alert('유효하지 않은 요청입니다.');
        window.location.href="/";
      }
      this.setState ({
        status : true,
        user_id : res.data.message.user_id,
        user_name : res.data.message.user_name
      })
    })
    .catch(error => {
      console.log('error 발생');
      window.location.href="/";
    });
    this.handleUserInfo(this.state.status);
  }
  render() {
    return (
      <div className="content">
        <h2 className="info_title">{this.state.content}</h2>
        <p>{this.state.user_name}</p>
      </div>
    );
  }
}
export default UserInfo;