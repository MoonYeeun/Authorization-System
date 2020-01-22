import React, {Component} from 'react';
import { Switch, NavLink, Route, BrowserRouter as Router } from "react-router-dom";
import Header from '../Layout/Header';
//import Main from './Main';
import '../Layout/Layout.css'
import axios from "axios";


export const verifyToken = (url) => {
  return axios.get(url, {
    headers: {
      'authorization': localStorage.getItem('access_token'),
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
};
export const verifyRefreshToken = (url) => {
  let body = {
    refresh_token : localStorage.getItem('refresh_token')
  }
  return axios.post(url, body, {
    headers: {
      'authorization': localStorage.getItem('access_token'),
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
  })
};

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = { 
      accessToken : localStorage.getItem('access_token'),
      refreshToken : localStorage.getItem('refresh_token')
    };
  };
  //로그아웃 처리 
  handleLogout = () => {
    var url = '/users/logout';
    verifyToken(url)
    .then(res => {
        //access token 만료된 경우
        if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
          verifyRefreshToken(url) // refresh token 서버로 보낸다. 
          .then(res => {
            if(res.data.state === 'success') { //로그아웃 성공
                alert('Goodbye !');
                window.location.href="/";
            }
            else {
              console.log(res.data.message);
              alert('요청 실패. 다시 시도해 주세요');
            }
          })
          .catch(error => {
            window.location.href="/";
          });
        } else if(res.data.state === 'fail' && res.data.message !== 'jwt expired') {
          console.log(res.data.message);
          alert('요청 실패. 다시 시도해 주세요');
        } else { // access token 유효해서 로그아웃 성공한 경우 
            alert('Goodbye !');
            window.location.href="/";
        }
      })
      .catch(error => {
        window.location.href="/";
      }); 
  }
  //페이지 렌더링 전 토큰 검사 
  componentDidMount() {
    var url = '/users/verifyToken1'
    verifyToken(url)
    .then(res => {
      //access token 만료된 경우
      if(res.data.state === 'fail' && res.data.message === 'jwt expired'){

        verifyRefreshToken(url) // refresh token 서버로 보낸다. 
        .then(res => {
          if(res.status === '200') { //새롭게 발급받은 access token 저장 
            window.localStorage.setItem('access_token', res.data.data.access_token);
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
    })
    .catch(error => {
      window.location.href="/";
    });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Header />
          {/* <Main /> */}
          <div className="gnb">
            <NavLink exact className="tab" activeClassName="active" to="/Content_Home">Home</NavLink>
            <NavLink className="tab" activeClassName="active" to="/Content_UserInfo">User Info</NavLink>
            <NavLink className="tab" activeClassName="active" to="" onClick={this.handleLogout}>Logout</NavLink>
          </div>
          <Switch>
          <Route path="/Content_Home" component={Home} />
          <Route path="/Content_UserInfo" component={Content_UserInfo}/>
          </Switch>
        </div>      
      </Router>
    );
  }
}
export default Home;
