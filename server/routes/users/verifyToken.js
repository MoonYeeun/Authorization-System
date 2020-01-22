const express = require('express');
const router = express.Router();

const crypto = require('crypto-promise');		
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const secretKey = require('../../config/secretKey.js').secret;

//redis 접속
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1',{db:2}); //db 2 : 유저별 토큰 관리 db

//토큰 검증 - access token 
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    const verify = jwt.verify(access_token);
    console.log('검증 ' + verify);
    if(verify.user_id){
        res.status(201).send({
            state: 'success',
            message: 'Token verified !'
        })
    } else {
        res.send({
            state: 'fail',
            message: verify
        })
    }
});
// 토큰 검증 - access token & refresh token 
router.post('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let refresh_token = req.body.refresh_token;

    const verify = jwt.verify(access_token);
    if(verify.user_id){ // access token 만료 안된 경우
        res.status(201).send({
            state: 'success',
            message: 'Token verified !'
        })
    }
    //access token 만료인 경우 -> refresh_token 발행
    else if(verify === 'jwt expired') {
        const payload = jwt.verify(access_token,{ignoreExpiration: true} );
        await client.hget(payload.user_id, 'refresh_token', (err, reply)=>{
            if(err) {
                res.status(500).send({
                    message: err
                })
            } else {
                if(reply === refresh_token) {
                    // 새로운 토큰 생성
                    access_token = jwt.sign(payload.user_id);
                    console.log('새로운 access token '+ access_token);
                    res.status(200).send({
                        state: 'success',
                        message: access_token
                    })
                } else { // refresh token 기간 만료거나 유효하지 않은 경우 -> 새로 로그인
                    console.log('refresh 토큰 이상');
                    res.status(401).send({
                        message: err
                    })
                }
            }
        });
    } else { // 잘못된 access token 값
        console.log('잘못된 토큰 값');
        res.status(401).send({
            message: err
        })
    }

})
module.exports = router;