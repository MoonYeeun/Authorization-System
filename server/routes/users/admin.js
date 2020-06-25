const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const verify = require('../../controller/verify');

//access token 검증 후 사용자 목록 불러오기  
router.get('/', async (req, res) => {
    let access_token = req.headers['authorization'];
    console.log('Admin 사용자 정보 위한 검증 ');

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

module.exports = router;