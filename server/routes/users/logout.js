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
    } // access token 만료된 경우 
    else if (result.state === 'fail' && result.message === 'jwt expired') {
        res.send(result);
    }
    else {
        res.status(400).send(result);
    }
});

module.exports = router;