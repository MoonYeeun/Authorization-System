const express = require('express');
const router = express.Router();

const crypto = require('crypto-promise');		
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
//redis 접속
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

//토큰 검증 - access token 
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    const verify = jwt.verify(access_token);
    console.log('검증 ' + verify);
    if(verify.user_id){
        // 로그인 된 사용자인지 검증 
        await client.select(3);
        await client.exists(verify.user_id, async function(err, reply){
            if(err) {
                res.send({
                    state: 'fail',
                    message: err
                });
            } else if(reply !== 0) { // 로그아웃 된 사용자인 경우 
                res.send({
                    state: 'fail',
                    message: '유효하지 않은 접근입니다.'
                });
            } else {
                res.status(201).send({
                    state: 'success',
                    message: 'Token verified !'
                });
            }
        });      
    } else {
        res.send({
            state: 'fail',
            message: verify
        });
    }
});

// 토큰 검증 - access token & refresh token 
router.post('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let refresh_token = req.body.refresh_token;

    const verify = jwt.verify(access_token);
    //유효한 access token 값 들어왔을 경우 
    if(verify.user_id){
        // 로그인 된 사용자인지 검증 
        await client.select(3);
        await client.exists(verify.user_id, async function(err, reply){
            if(err) {
                res.send({
                    state: 'fail',
                    message: err
                });
            } else if(reply !== 0) { // 로그아웃 된 사용자인 경우 
                res.send({
                    state: 'fail',
                    message: '유효하지 않은 접근입니다.'
                });
            } else {
                res.status(201).send({
                    state: 'success',
                    message: 'Token verified !'
                });
            }
        });      
    } 
    else if(verify === 'jwt expired') {
        const payload = jwt.verify(access_token,{ignoreExpiration: true} );
        if(payload.user_id){ 
            try {
                await client.select(3);
                await client.exists(payload.user_id, async function(err, reply){
                    if(err) {
                        res.status(500).send({
                            state: 'fail',
                            message: err
                        });
                    } else if(reply !== 0) { // 로그아웃 된 사용자인 경우 
                        console.log('유효하지 않은 접근입니다.');
                        res.status(401).send({
                            state: 'fail',
                            message: '유효하지 않은 접근입니다.'
                        });
                    } else {
                        await client.select(2);
                        await client.hget(payload.user_id, 'refresh_token', async function(err,reply){
                            if(err) {
                                res.status(500).send({
                                    message: err
                                });
                            } else {
                                console.log('reply '+reply);
                                if(reply === refresh_token) {
                                    // 새로운 토큰 생성
                                    access_token = jwt.sign(payload.user_id);
                                    console.log('새로운 access token '+ access_token);
                                    res.status(200).send({
                                        state: 'success',
                                        message: access_token
                                    });
                                } else { // refresh token 기간 만료거나 유효하지 않은 경우 -> 새로 로그인
                                    console.log('refresh 토큰 이상');
                                    res.status(401).send({
                                        message: 'token is not valid'
                                    });
                                }
                            }
                        });
                    }
                }); 

            } catch (err){
                console.log(err);
                res.status(401).send({
                    state: 'fail',
                    message: err
                });
            }
        } else {
            console.log('잘못된 access 토큰 값');
            res.status(401).send({
                message: verify
            });
        }
    } else { // 잘못된 access token 값
        console.log('잘못된 access 토큰 값');
        res.status(401).send({
            message: verify
        });
    }

})
module.exports = router;