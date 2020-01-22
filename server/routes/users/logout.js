const express = require('express');
const router = express.Router();

const jwt = require('../../module/jwt.js');
//redis 접속
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

var moment = require('moment');
//로그아웃
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    const verify = jwt.verify(access_token);
    if(verify.user_id){ // access token 유효한 경우
        try {
            await client.select(2);
            await client.del(verify.user_id);
            await client.select(3);
            await client.set(verify.user_id,moment().format());
            return res.status(201).send({
                state: 'success',
                message: 'Logout success !'
            });
        } catch(err) {
            return res.send({
                state : 'fail',
                message : err
            });
        } 
    } else { // access token 유효하지 않은 경우 refresh token 요청
        res.send({
            state : 'fail',
            message: verify
        });
    }
});
// access token 만료 후 로그아웃 하려고 하는 경우 
router.post('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let refresh_token = req.body.refresh_token;

    let verify = jwt.verify(access_token);
    //access token 만료인 경우 -> refresh_token 검사 후 access token 새로 발행
    if(verify === 'jwt expired') {
        const payload = jwt.verify(access_token,{ignoreExpiration: true} );
        try {
            await client.select(2);
            await client.hget(payload.user_id,'refresh_token', async function(err,reply){
                if (err) return err;
                else if(reply === refresh_token) {
                    // 새로운 access token 생성
                    access_token = jwt.sign(payload.user_id);
                    console.log('새롭게 발급한 access ' + access_token);
                    // refresh token 삭제 & logout db 에 사용자 저장 
                    verify = jwt.verify(access_token);
                    if(verify.user_id){ 
                        await client.del(verify.user_id);
                        await client.select(3);
                        await client.set(verify.user_id,moment().format());
                        console.log('로그아웃 완료');
                        return res.status(201).send({
                            state: 'success',
                            message: 'Logout success !'
                        });     
                    }
                } else { // 일치하지 않는 refresh token 보냈을 경우 
                    return res.status(401).send({
                        state : 'fail',
                        message: 'refresh token is not valid'
                    });   
                }             
            });
            
        } catch(err) {
            return res.send({
                state : 'fail',
                message: err
            });   
        } 
    } else { // 잘못된 access token 값
        res.send({
            state : 'fail',
            message: verify
        });
    }
})
module.exports = router;