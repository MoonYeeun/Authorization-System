import React, {Component} from 'react';
import { NavLink, Route, BrowserRouter as Router } from "react-router-dom";
import Header from '../Layout/Header';
import Footer from '../Layout/Footer';
import '../Layout/Layout.css'
import Content_Home from './Content_Home';
import UserInfo from './UserInfo';
import AdminPage from '../Home/AdminPage';
import axios from "axios";


//로그인 후 보이는 메인화면
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      logged : false, // 로그인 되었는지 확인하는 변수 
      admin : localStorage.getItem('admin'), // 관리자인지 확인
      access_token : localStorage.getItem('access_token')
    };
  };

  setHeaders = () => {
    let headers = {
      'authorization' : this.state.access_token,
      'Accept' : 'application/json',
      'Content-Type': 'application/json'
    }
    return headers;
  }
  //로그아웃 처리 
  handleLogout = () => {
    this.setState({
      logged : false
    })
    axios.get('/users/logout', {headers :this.setHeaders()})
    .then(res => {
        //access token 만료된 경우
        if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
          console.log('logout refresh 검사');
          this.requestAccessToken('/users/verifyToken');

          setTimeout(
            function() {
                if(this.state.logged === true) this.handleLogout();
            }.bind(this),1000
          );
          
        } else { // access token 유효해서 로그아웃 성공한 경우 
          console.log('logout ?' + res.data.message);
          alert('Goodbye !');
          window.location.href="/";
        }
      })
      .catch(error => {
        console.log(error);
      }); 
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
            logged : true,
            access_token : res.data.message
        })
        window.localStorage.setItem('access_token', res.data.message);
      }
    })
    .catch(error => {
      alert('유효하지 않은 접근입니다.');
      window.location.href="/";
    });
  }

  //페이지 렌더링 전 토큰 검사 
  componentDidMount() {
    axios.get('/users/verifyToken', {headers :this.setHeaders()})
    .then(res => {
      //access token 만료된 경우
      if(res.data.state === 'fail' && res.data.message === 'jwt expired'){
        this.setState({
          logged: false
        });
        this.requestAccessToken('/users/verifyToken');
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
            <NavLink exact className="tab" activeClassName="active" to="/Home/Content_Home">Home</NavLink>
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
