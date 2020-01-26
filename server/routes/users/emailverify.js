var express = require('express');
var router = express.Router();
const db = require('../../module/pool.js');
//redis 접속
const redis = require('../../module/redis');

//이메일 인증 확인 후 유저정보 mysql db 저장
router.get('/:emailCode', async (req, res) => {
    let emailCode = req.params.emailCode;
    console.log(emailCode);
    
    let result = await redis.get(emailCode, 1)
    .catch((err) => {
        res.send({
            message: err
        }) 
    });

    let user_data = JSON.parse(result);
    if(!user_data) {
        res.redirect('http://localhost:3000/EmailVerifyFail');
    } else {
        let selectQuery = 'SELECT COUNT(*) count FROM user WHERE user_id = ?';
        let selectResult = await db.queryParam_Arr(selectQuery, [user_data.user_id]);
        // 이미 등록된 사용자이거나 err 발생한 경우 
        if (!selectResult || selectResult[0].count == 1) {
            res.redirect('http://localhost:3000/EmailVerifyFail');
        } else {
            //users table에 새로운 user 등록
            let insertQuery = 'INSERT INTO user (user_id, user_pwd, user_name, user_salt) values ( ?, ?, ?, ?)';
            let insertResult = db.queryParam_Arr(insertQuery, [user_data.user_id, user_data.user_pwd, user_data.user_name, user_data.user_salt]);
    
            if (!insertResult) {
                console.log("DB Insert Error");
                res.redirect('http://localhost:3000/EmailVerifyFail');
            } else {    //정상적으로 회원가입 완료
                console.log("Signup Success");
                res.redirect('http://localhost:3000/EmailVerify');
            }
        }
    }
    
});

module.exports = router;