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

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.logged !== this.props.logged) {
      this.handleUserInfo(nextProps.logged);
    }
    return true;
  }
  
  handleUserInfo = (status) => {
    status ? this.setState({content: 'Hi !'}) 
    : this.setState({
      content: 'Not Found',
      user_id: '',
      user_name: ''
    });
}

  // user 목록 불러오기
  getUserList= async () => {
    const { requestAccessToken, setHeaders } = this.props;

    axios.get('/users/userInfo', {headers : setHeaders()})
    .then(async res => {
      if(res.data.state === 'success') {
        this.setState ({
            content: 'Hi !',
            user_id : res.data.message.user_id,
            user_name : res.data.message.user_name
        })
      } else {
        this.handleUserInfo(false);
        await requestAccessToken('/users/verifyToken');
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