import React, {Component} from 'react';
import './auth.css';
import { Link } from "react-router-dom";
import axios from "axios";

//서버로 입력된 값 보내는 함수 
export const sendUserInfo = obj => {
  console.log(obj);
  return axios.post('/users/signup', {
    user_id: obj.user_id,
    user_name: obj.user_name,
    user_pwd: obj.user_pwd
  })
};
//회원가입 페이지 
class Signup extends Component {
  state = {
      nameEntered: '',
      isNameVaild: false,
      emailEntered: '',
      isEmailValid: false,
      pwdEntered: '',
      isPwdValid: false,
      pwdCheck : ''
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
  // name 창 입력 시 ( 3자리 이상으로 입력 )
  handleNameChange = (e) => {
    if (e.target.value.length >=3) {
      this.setState({
        isNameVaild: true,
        nameEntered : e.target.value
      });
    } else {
      this.setState({
        isNameVaild: false,
        nameEntered : e.target.value
      });
    }
  }
  isEnteredNameValid = () => {
    const { nameEntered, isNameVaild } = this.state;

    if (nameEntered) return isNameVaild;
  }
  // pwd 창 입력 시 ( 8 - 16 자리 이내로 입력 )
  handlePwdChange = (e) => {
    if (e.target.value.length >= 8 && e.target.value.length <= 16) {
      this.setState({
        isPwdValid: true,
        pwdEntered : e.target.value
      });
    } else {
      this.setState({
        isPwdValid: false,
        pwdEntered : e.target.value
      });
    }
  }
  isEnteredPwdValid = () => {
    const { pwdEntered, isPwdValid } = this.state;

    if (pwdEntered) return isPwdValid;
  }
    //pwd 확인 창 입력 시 
  handlePwdCheck = (e) => {
      this.setState({
        pwdCheck : e.target.value
    });
  }
  doesPasswordMatch = () =>{
    const { pwdEntered, pwdCheck } = this.state;
    return pwdEntered === pwdCheck;
  }
  confirmPasswordClassName = () => {
    const { pwdCheck } = this.state;
  
    if (pwdCheck) {
      return this.doesPasswordMatch() ? 'is-valid' : 'is-invalid';
    }
  }
  //submit 버튼 클릭 시 
  handleSubmit = (e) => {
    e.preventDefault();
    //모든 정보 잘 입력한 경우
    if(this.state.isPwdValid && this.state.isNameVaild && this.state.isEmailValid && this.doesPasswordMatch()===true) { 
      var obj = {
        user_name : this.state.nameEntered,
        user_id : this.state.emailEntered,
        user_pwd : this.state.pwdEntered
      }
      sendUserInfo(obj)
      .then(res => {
        console.log(res);
        setTimeout(()=> {
          alert(res.data.message);
        },0);
      })
      .catch(error => {
        console.log(error);
        alert(error);
      });
    }
    else {
      if(!this.state.isPwdValid && this.state.isNameVaild && this.state.isEmailValid){
        this.pwdInput.focus();
        alert('password 정보를 정확히 입력하세요');
      } else if(!this.state.isNameVaild && this.state.isEmailValid && this.state.isPwdValid){
        this.nameInput.focus();
        alert('이름 정보를 정확히 입력하세요');
      } else if(!this.state.isEmailValid && this.state.isPwdValid && this.state.isNameVaild){
        this.emailInput.focus();
        alert('이메일 정보를 정확히 입력하세요');
      } else {
        alert('회원 정보를 정확히 입력하세요');
      }
    }
  }
    render() {
    return (
      <div className="auth">
        <form className="SigninForm" onSubmit={this.handleSubmit}>
          <p> 회원가입 </p>
          <div className="form-group">
            <input
              type="text"
              className={`form-control ${this.inputClassNameHelper(this.isEnteredNameValid())}`}
              ref={(input) => { this.nameInput = input;}}
              id="nameInput"
              placeholder="이름"
              value={this.state.nameEntered}
              onChange={this.handleNameChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className ={`form-control ${this.inputClassNameHelper(this.isEnteredEmailValid())}`}
              ref={(input) => { this.emailInput = input; }}
              id="emailInput"
              aria-describedby="emailHelp"
              placeholder="email"
              value={this.state.emailEntered}
              onChange={e=>this.vaildEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className ={`form-control ${this.inputClassNameHelper(this.isEnteredPwdValid())}`}
              ref={(input) => { this.pwdInput = input; }}
              id="pwdInput"
              placeholder="비밀번호"
              value={this.state.pwdEntered}
              onChange={this.handlePwdChange}
            />
          </div>
          <div className="form-group">           
            <input
              type="password"
              className ={`form-control  ${this.confirmPasswordClassName()}`}
              ref={(input) => { this.pwdCheckInput = input; }}
              id="pwdCheckInput"
              placeholder="비밀번호 확인"
              value={this.state.pwdCheck}
              onChange={this.handlePwdCheck}
            />
          </div>
          <div className="buttonGroup">            
          <button type="submit" value="Submit" className="btn button_submit btn-outline-success btn-block">
            Submit
          </button>
          <Link to="/Signin">
          <button type="submit" className="btn button_cancel btn-outline-primary btn-block">
            cancel
          </button>
          </Link>
          </div>          
        </form>
      </div>
    );
  }
}

export default Signup;
