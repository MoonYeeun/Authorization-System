var express = require('express');
var router = express.Router();

//계정관리 (로그인, 회원가입)
const users = require('./users/index');
router.use('/users',users);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

module.exports = router;
