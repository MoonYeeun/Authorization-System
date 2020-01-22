import React, {Component} from 'react';
import './emailVerify.css';
import { Link } from "react-router-dom";

//btn button_cancel btn-outline-primary btn-block
class EmailVerify extends Component {
    render() {
        return (
            <div className="page">
                <form className="emailverfiyForm" onSubmit={this.handleSubmit}>
                <p>이메일 인증이 완료되었습니다 !</p>
                <div>
                <Link to="/Signin">
                <button type="submit" className="fun-btn">
                    Log in 
                </button>
                </Link>                        
                </div>     
                </form>
        </div>
        );
    }
}
export default EmailVerify;