const express = require('express');
const router = express.Router();

const verify = require('../../controller/verify');
const redis = require('../../module/redis');
const moment = require('moment');

var logout = async (user_id, time) => {
    try {
        await redis.del(user_id, 2);
        await redis.set(user_id, time, 3);
        return {
            state : 'success',
            message : 'Logout success !'
        };
    } catch(err) {
        return {
            state : 'fail',
            message : err
        };
    }
}

//로그아웃
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let result = await verify.token_verify(access_token)
    .catch((err) => {
        res.status(500).send(err);
    });
    // access token 유효한 경우
    if(result.state === 'success') {
        let logout_result = await logout(result.user_id, moment().format())
        .catch((err) => {
            res.status(500).send(err);
        });
        console.log('logout 성공');
        res.send(logout_result);
    } else {
        res.send(result);
    }
});

// access token 만료 후 로그아웃 하려고 하는 경우 
router.post('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let refresh_token = req.body.refresh_token;
    let result = await verify.token_verify(access_token);

    // access token 유효한 경우 
    if(result.state === 'success') {
        let logout_result = await logout(result.user_id, moment().format())
        .catch((err) => {
            res.send(err);
        });
        console.log('logout 성공');
        res.send(logout_result);
    }
    // access token 만료된 경우 
    else if (result.state === 'fail' && result.message === 'jwt expired') {
        // 만료된 토큰 유효성 검사 
        let payload_result = await verify.token_verify(access_token, {ignoreExpiration: true});
        // 로그아웃 된 사용자거나 유효하지 않은 경우 
        if(payload_result.state === 'fail') res.status(401).send(payload_result);
        else {
            let refresh_result = await verify.refreshToken_verify(payload_result.user_id, refresh_token)
            .catch((err) => {
                res.status(500).send(err);
            });
            access_token = refresh_result.message; // 새로운 access token 저장
            let logout_result = await logout(payload_result.user_id, moment().format())
            .catch((err) => {
                res.status(401).send(err);
            });
            console.log('logout 성공');
            res.send(logout_result);
        }
    } else { // 잘못된 access token 값
        console.log('잘못된 access 토큰 값');
        res.status(401).send(result);
    }
})
module.exports = router;