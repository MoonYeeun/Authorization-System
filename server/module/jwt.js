const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey.js').secret;

module.exports = {
  // access token 생성
  sign : function(user_id) { 
    const options = {
      algorithm : "HS256",
      expiresIn : 10 // 1분
    };
    const payload = {
      user_id : user_id
    };
    return jwt.sign(payload, secretKey, options);
  },

  verify : function(token, options) {
    let decoded;
    try {
      decoded = jwt.verify(token, secretKey, options);
    }
    catch(err) {
      return err.message;
    }
    return decoded;
  }, 

  // refresh token 생성
  refresh : function(key) { 
    const options = {
      algorithm : "HS256",
      expiresIn : 20
      //expiresIn : 60 * 5 // 5분
    };
    const payload = {
      key : key
    };
    return jwt.sign(payload, secretKey, options);
  }
};