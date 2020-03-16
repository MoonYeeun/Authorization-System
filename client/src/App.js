import React, {Component} from 'react';
import './App.css';
import Signin from './Component/Auth/Signin';
import Signup from './Compoenet/Auth/Signup';
import EmailVerify from './Component/Auth/EmailVerify';
import EmailVerifyFail from './Component/Auth/EmailVerifyFail';
import Home  from './Component/Home';
import { Route, BrowserRouter as Router } from "react-router-dom";
class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
         <Route exact path="/" component={Signin} />
         <Route path="/Signin" component={Signin}/>
         <Route path="/Signup" component={Signup}/>
         <Route path="/EmailVerify" component={EmailVerify}/>
         <Route path="/EmailVerifyFail" component={EmailVerifyFail}/>
         <Route path="/Home" component={Home} />
      </div>      
      </Router>
     
    );
  }
}

export default App;
