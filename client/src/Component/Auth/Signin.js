import React, {Component} from 'react';
import './auth.css';
import { Link } from "react-router-dom";
import axios from "axios";

export const sendLoginInfo = obj => {
  console.log(obj);
  return axios.post('/users/signin', {
    user_id: obj.user_id,
    user_pwd: obj.user_pwd
  })
};
//로그인 페이지 
class Signin extends Component {
  state = {
    emailEntered: '',
    pwdEntered: '',
    token: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  //submit 버튼 입력 시 
  handleSubmit = (e) => {
    e.preventDefault();
    var obj = {
      user_id : this.state.emailEntered,
      user_pwd : this.state.pwdEntered
    }
    sendLoginInfo(obj)
    .then(res => {
      console.log(res);
      alert(res.data.message);
      //로그인 성공 시
      if(res.data.message === 'Login Success'){
        console.log(res.data.data.access_token);
        console.log(res.data.data.refresh_token);
        window.localStorage.setItem('access_token', res.data.data.access_token);
        window.localStorage.setItem('refresh_token', res.data.data.refresh_token);
        window.localStorage.setItem('admin', res.data.data.admin);
        window.location.href="/Home"
      }
    })
    .catch(error => {
      console.log(error);
      alert(error);
    });
  }
  
  render() {
    return (
      <div className="auth">
        <form className="SignupForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailInput">이메일</label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              value={this.state.emailEntered}
              name= "emailEntered"
              placeholder="abc@gmail.com"
              onChange={this.handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNumberInput">비밀번호</label>
            <input
              type="password"
              className="form-control"
              id="pwdInput"
              placeholder="password"
              value={this.state.pwdEntered}
              name="pwdEntered"
              onChange={this.handleChange}              
            />
          </div>

          <button type="submit" value="Submit" className="btn btn-login btn-outline-primary btn-block">
            Login
          </button>         
          <div className="btn-signup">
          <Link to="/Signup">
            <button type="signup" className="btn btn-outline-secondary btn-block">
              signup
            </button>
          </Link>
          </div>
          <Link to="/">
          <div>
            <button type="find_password" className="btn btn-link">forgot your password ?  </button>
          </div>
          </Link>
        </form>
      </div>
    );
  }
}

export default Signin;
