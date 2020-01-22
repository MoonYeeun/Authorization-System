var express = require('express');
var router = express.Router();

//로그인
const signin = require('./signin');
router.use('/signin',signin);

//회원가입
const signup = require('./signup');
router.use('/signup',signup);

//이메일 인증
const emailverify = require('./emailverify');
router.use('/emailverify',emailverify);

//로그아웃
const logout = require('./logout');
router.use('/logout', logout);

//토큰 검증
const verifyToken = require('./verifyToken1');
router.use('/verifyToken1', verifyToken);

module.exports = router;