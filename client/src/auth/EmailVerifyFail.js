import React, {Component} from 'react';
import './emailVerify.css';
import { Link } from "react-router-dom";

//이메일 인증 완료 후 나타나는 페이지 
class EmailVerifyFail extends Component {
    render() {
        return (
            <div className="page">
                <form className="emailverfiyForm" onSubmit={this.handleSubmit}>
                <h3 className="fail_title">Fail to Email verified. </h3>
                <p>Please retry Signup again</p>
                <div>
                <Link to="/Signin">
                <button type="submit" className="fun-btn">
                    Cancel
                </button>
                </Link>                        
                </div>     
                </form>
        </div>
        );
    }
}
export default EmailVerifyFail;