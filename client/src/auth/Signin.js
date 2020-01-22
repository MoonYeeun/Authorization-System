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

class Signin extends Component {
  state = {
    emailEntered: '',
    isEmailValid: false,
    pwdEntered: '',
    token: ''
  }
  //이메일 유효성 검증
    vaildEmail = emailEntered => {
      const emailRegExp = /^[\w-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/;

    if (emailEntered.match(emailRegExp)) {
      this.setState({
        isEmailValid: true,
        emailEntered
      });
    } else {
      this.setState({
        isEmailValid: false,
        emailEntered
      });
    }
  }
  isEnteredEmailValid = () => {
    const { emailEntered, isEmailValid } = this.state;
  
    if (emailEntered) return isEmailValid;
  };

  inputClassNameHelper = boolean => {
    switch (boolean) {
      case true:
        return 'is-valid';
      case false:
        return 'is-invalid';
      default:
        return '';
    }
  };
  // pwd 창 입력 시 
  handlePwdChange = (e) => {
    this.setState({
      pwdEntered: e.target.value
    });
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
      setTimeout(()=> {
        alert(res.data.message);
        //로그인 성공 시
        if(res.status === 201){
          console.log(res.data.data.access_token);
          console.log(res.data.data.refresh_token);
          window.localStorage.setItem('access_token', res.data.data.access_token);
          window.localStorage.setItem('refresh_token',res.data.data.refresh_token);
          window.location.href="/Home"
        }
        
      },0);
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
              className ={`form-control ${this.inputClassNameHelper(this.isEnteredEmailValid())}`}
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="abc@gmail.com"
              onChange={e=>this.vaildEmail(e.target.value)}
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
              onChange={this.handlePwdChange}              
            />
          </div>

          <button type="submit" value="Submit" className="btn btn-login btn-outline-primary btn-block">
            Login
          </button>         
          <div className="signup">
          <Link to="/Signup">
            <button type="signup" className="btn btn-outline-secondary btn-block">
              signup
            </button>
          </Link>
          </div>
          <div>
            <button type="find_password" className="btn btn-link">forgot your password ?  </button>
          </div>
        </form>
      </div>
    );
  }
}

export default Signin;
