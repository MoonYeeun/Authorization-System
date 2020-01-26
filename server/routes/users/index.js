var express = require('express');
var router = express.Router();

//로그인
const signin = require('./signin');
router.use('/signin',signin);

//회원가입
const signup = require('./signup');
router.use('/signup',signup);

//이메일 인증
const emailverify = require('./emailVerify');
router.use('/emailverify',emailverify);

//로그아웃
const logout = require('./logout');
router.use('/logout', logout);

//토큰 검증
const verifyToken = require('./verifyToken');
router.use('/verifyToken', verifyToken);

//사용자 정보 가져오기
const userInfo = require('./userInfo');
router.use('/userInfo', userInfo);

module.exports = router;