const jwt = require('jsonwebtoken');

const secretKey = require('../config/secretKey.js').secret;


module.exports = {
  sign : function(user_id) { // access token 생성
    const options = {
      algorithm : "HS256",
      expiresIn : 60
    };
    const payload = {
      user_id : user_id
    };
    let token = jwt.sign(payload, secretKey, options);
    return token;
  },
  verify : function(token, options) {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey, options);
    }
    catch(err) {
      //if(err.message === 'jwt expired') console.log('expired token');
      //else if(err.message === 'invalid token') console.log('invalid token');
      return err.message;
    }
    if(!decoded) {
      //return -1;
    }else {
      return decoded;
    }
  }, // refresh token 생성
  refresh : function(key) {
    const options = {
      algorithm : "HS256",
      //expiresIn : 60 * 60 * 24 * 14 //2주
      expiresIn : 60 * 5
    };
    const payload = {
      key : key
    }
    let refresh_token = jwt.sign(payload,secretKey, options);
    return refresh_token;
  }
};