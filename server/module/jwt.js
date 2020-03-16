const jwt = require('jsonwebtoken');
const secretKey = require('../config/secretKey.js').secret;

module.exports = {
  sign : function(user_id) { // access token 생성
    const options = {
      algorithm : "HS256",
      expiresIn : 60 // 1분
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
      //expiresIn : 60 * 60 * 24 * 14 //2주
      expiresIn : 60 * 5 // 5분
    };
    const payload = {
      key : key
    };

    return jwt.sign(payload, secretKey, options);
  }
};