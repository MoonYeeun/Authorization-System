import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Layout/Layout.css'

const Main = () => {   
    return (
        <div className="gnb">
            <NavLink exact className="tab" activeClassName="active" to="/Content_Home">Home</NavLink>
            <NavLink className="tab" activeClassName="active" to="/Content_UserInfo">User Info</NavLink>
            <NavLink className="tab" activeClassName="active" to="/">Logout</NavLink>
       </div>
    );
};

export default Main;