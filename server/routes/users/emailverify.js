var express = require('express');
var router = express.Router();
//redis 접속
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');
const crypto = require('crypto-promise');
const db = require('../../module/pool.js');

//이메일 인증 확인 후 유저정보 mysql db 저장
router.get('/:key_for_verify', async (req, res) => {
    let verifyKey = req.params.key_for_verify;
    console.log(verifyKey);
    let user_data;
    await client.get(verifyKey, async function(err, reply){
        if(err) {
            res.send({
                message: 'Server Error'
            }) 
        } else {
            user_data = JSON.parse(reply);
            console.log(user_data);
            if(!user_data){
                res.send({
                    message: 'Invalid user'
                })
            } else {
                //user_id가 원래 있는지 검사
                let selectQuery = 'SELECT COUNT(*) count FROM user WHERE user_id = ?';
                let selectResult = await db.queryParam_Arr(selectQuery, [user_data.user_id]);
                console.log('result ', selectResult);
                if (!selectResult) {
                    res.status(500).send( {
                        message : "Internal Server Error"
                    })
                } else if (selectResult[0].count == 1) {
                    console.log("ID is already");
                    res.send( {
                        message : "ID Already Exists"
                    });
                } else {
                    //users table에 새로운 user 등록
                    let insertQuery = 'INSERT INTO user (user_id, user_pwd, user_name, user_salt) values ( ?, ?, ?, ?)';
                    let insertResult = db.queryParam_Arr(insertQuery, [user_data.user_id, user_data.user_pwd, user_data.user_name, user_data.user_salt]);
            
                    if (!insertResult) {
                        console.log("DB Insert Error");
                        res.status(500).send( {
                            message : "Internal Server Error"
                        })
                    } else {    //정상적으로 회원가입 완료
                        console.log("Signup Success");
                        res.redirect('http://localhost:3000/EmailVerify');
                    }
                }
                
            }
        }
    })

});

module.exports = router;