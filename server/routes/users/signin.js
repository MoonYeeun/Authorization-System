const express = require('express');
const router = express.Router();

const crypto = require('crypto-promise');		
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
//redis 접속
var redis = require('redis');
//var client = redis.createClient(6379,'127.0.0.1',{db:2}); //db 2 : 유저별 토큰 관리 db
var client = redis.createClient(6379,'127.0.0.1');

//로그인
router.post('/', async (req, res) => {
    let user_id = req.body.user_id;
    let user_pw = req.body.user_pwd;

    if (!user_id || !user_pw) {
        console.log("NULL");
        res.status(200).send( {
            message : "Null Value"
        })
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?';
        let checkResult = await db.queryParam_Arr(checkQuery, [user_id]);
        console.log(checkResult);
        if (!checkResult) {
            res.status(500).send( {
                message : "Internal Server Error"
            })
        } else if (checkResult.length == 1) {     
            let pwHashed = await crypto.pbkdf2(user_pw, checkResult[0].user_salt, 10000, 32, 'sha512');
            //사용자 아이디 비밀번호 일치할 경우 
            if (pwHashed.toString('base64') == checkResult[0].user_pwd) {
                // 발행할 토큰 생성
                let access_token = jwt.sign(checkResult[0].user_id);
                var key= await crypto.randomBytes(32); 
                let refresh_token = jwt.refresh(key);
                console.log(access_token);
                console.log(refresh_token);
                //redis에 유저 refresh token 저장 및 로그아웃 db에서 사용자 삭제 
                const redisConnect = async () => {
                    await client.select(2);
                    await client.hset(user_id, 'refresh_token', refresh_token);
                    await client.expire(user_id, 60*5);
                    await client.select(3);
                    await client.del(checkResult[0].user_id);
                }
                redisConnect()
                .catch(err => {
                    return res.status(500).send( {
                        message : "Internal Server Error"
                    })
                })
                // res.cookie('token', {
                //     'access_token' : access_token,
                //     'refresh_token' : refresh_token
                // }, {signed : true});

                res.status(201).send( {
                    message : "Login Success",
                    data : {
						'access_token' : access_token,
						'refresh_token' : refresh_token
					}
                });
            } else {    //비밀번호 틀렸을 때
                console.log("pwd error");	
                res.status(200).send( {
                    message : "Login Failed : pw error"
                });
            }

        } else { // id 틀렸을 때
            console.log("id error");
            res.status(200).send( {
                message : "Login Failed : Id error"
            });
        }

    }
});

module.exports = router;