import React, {Component} from 'react'; 
import { Link } from "react-router-dom";
import './Layout.css';


class Footer extends Component {

    render() {
        return (
            <div className="footer">
              <p className="footer_title">admin</p>
              <Link to='/Home/AdminPage'>
                <img className="img" src={require('../../img/admin.png')} alt="fireSpot"></img>
              </Link>
            </div> 
        )  
    }
}
export default Footer;

