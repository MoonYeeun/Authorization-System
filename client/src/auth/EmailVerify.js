import React, {Component} from './node_modules/react';
import './emailVerify.css';
import { Link } from "./node_modules/react-router-dom";

//이메일 인증 완료 후 나타나는 페이지 
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