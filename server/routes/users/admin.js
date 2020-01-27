const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const verify = require('../../controller/verify');

//access token 검증 후 사용자 목록 불러오기  
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    console.log('Get 사용자 정보 위한 검증 ' + verify);

    let result = await verify.token_verify(access_token)
    .catch((err) => {
        res.status(500).send(err);
    });
    if(result.state === 'fail') res.send(result);
    else {
        let checkQuery = 'SELECT user_id, user_name FROM user';
        let checkResult = await db.queryParam_Arr(checkQuery)
        .catch((err) => {
            res.send( {
                state: 'fail',
                message : "Internal Server Error"
            });
        })
        console.log(checkResult);
        res.status(200).send({
            state: 'success',
            message: checkResult
        });
    }
});

// 토큰 검증 ( access token & refresh token ) 후 사용자 목록 불러오기
router.post('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    let refresh_token = req.body.refresh_token;

    try {
        let result = await verify.token_verify(access_token);
        // access token 유효한 경우 
        if(result.state === 'success') res.status(200).send(result);
        // access token 만료된 경우 
        else if (result.state === 'fail' && result.message === 'jwt expired') {
            // 만료된 토큰 유효성 검사 
            let payload_result = await verify.token_verify(access_token, {ignoreExpiration: true});
            // 로그아웃 된 사용자거나 유효하지 않은 경우 
            if(payload_result.state === 'fail') res.status(401).send(payload_result);
            else {
                // refresh token 유효한 경우 
                let refresh_result = await verify.refreshToken_verify(payload_result.user_id, refresh_token);
                
                let checkQuery = 'SELECT user_id, user_name FROM user';
                let checkResult = await db.queryParam_Arr(checkQuery);
                res.status(200).send({
                    state: 'success',
                    message: {
                        access_token : refresh_result.message,
                        user_list : checkResult
                    }
                });
            }
        } else { // 잘못된 access token 값
            console.log('잘못된 access 토큰 값');
            res.status(401).send(result);
        }
    } catch(err) {
        console.log(err);
        res.status(500).send(err);
    };
})
module.exports = router;