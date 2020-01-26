import React, {Component} from 'react';
import { NavLink, Route, BrowserRouter as Router } from "react-router-dom";
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css'
import Content_Home from './Content_Home';
import UserInfo from './UserInfo';
import AdminPage from '../Home/AdminPage';
import axios from "axios";

export const verifyToken = (url) => {
  let headers = {
    'authorization': localStorage.getItem('access_token'),
    'Accept' : 'application/json',
    'Content-Type': 'application/json'
  }
  return axios.get(url, {headers})
};
export const verifyRefreshToken = (url) => {
  let body = {
    refresh_token : localStorage.getItem('refresh_token')
  }
  let headers = {
    'authorization': localStorage.getItem('access_token'),
    'Accept' : 'application/json',
    'Content-Type': 'application/json'
  }
  return axios.post(url, body, {headers})
};
//로그인 후 보이는 메인화면
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      logged : false, // 로그인 되었는지 확인하는 변수 
      admin : localStorage.getItem('admin') // 관리자인지 확인
    };
  };
  //로그아웃 처리 
  handleLogout = () => {
    verifyToken('/users/logout')
    .then(res => {
        //access token 만료된 경우
        if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
          verifyRefreshToken('/users/logout') // refresh token 서버로 보낸다. 
          .then(res => {
            if(res.data.state === 'success') { //로그아웃 성공
                this.setState ({
                    logged : false
                })
                alert('Goodbye !');
                window.location.href="/";
            }
            else {
              console.log(res.data.message);
              alert('요청 실패. 다시 시도해 주세요');
            }
          })
          .catch(error => {
            this.setState ({
                logged : false
            })
            window.location.href="/";
          });
        } else if(res.data.state === 'fail' && res.data.message !== 'jwt expired') {
          console.log(res.data.message);
          alert('요청 실패. 다시 시도해 주세요');
        } else { // access token 유효해서 로그아웃 성공한 경우 
            this.setState ({
                logged : false
            })
            alert('Goodbye !');
            window.location.href="/";
        }
      })
      .catch(error => {
        this.setState ({
            logged : false
        })
        window.location.href="/";
      }); 
  }
  //페이지 렌더링 전 토큰 검사 
  componentDidMount() {
    verifyToken('/users/verifyToken', this.state.headers)
    .then(res => {
      //access token 만료된 경우
      if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
        verifyRefreshToken('/users/verifyToken', this.state.headers) // refresh token 서버로 보낸다. 
        .then(res => {
          if(res.data.state === 'success') { //새롭게 발급받은 access token 저장 
            this.setState ({
                logged : true
            })
            window.localStorage.setItem('access_token', res.data.message);
          }
          console.log('mount 안'+this.state.logged);
        })
        .catch(error => {
          alert('유효하지 않은 접근입니다.');
          window.location.href="/";
        });
      } else if(res.data.state === 'fail' && res.data.message !== 'jwt expired') {
        console.log(res.data.message);
        alert('유효하지 않은 요청입니다.');
        window.location.href="/";
      } else {
        this.setState ({
          logged : true
        })
      }
    })
    .catch(error => {
      window.location.href="/";
    });
  }

  render() {
    console.log(this.state.logged);
    console.log(this.state.admin);
    return (
      <Router>
        <div className="App">
          <Header />
          <div className="gnb">
            <NavLink exact className="tab" activeClassName="active" to={`${this.props.match.path}/Content_Home`}>Home</NavLink>
            <NavLink className="tab" activeClassName="active" to="/Home/UserInfo">User Info</NavLink>
            <NavLink className="tab" activeClassName="active" to="" onClick={this.handleLogout}>Logout</NavLink>
          </div>
          {/* <Switch> */}
          <Route exact path={this.props.match.path} component={Content_Home} />
          <Route path="/Home/Content_Home"  component={Content_Home} />
          <Route path="/Home/UserInfo" render={(props) => <UserInfo {...props} logged = {this.state.logged}/>} />  
          <Route path="/Home/AdminPage" render={(props) => <AdminPage {...props} logged = {this.state.logged}
          admin = {this.state.admin} />} />   
          {/* </Switch> */}
          <Footer />
        </div>      
      </Router>
    );
  }
}
export default Home;
