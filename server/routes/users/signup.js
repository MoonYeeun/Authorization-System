var express = require('express');
var router = express.Router();
var mailSender = require('../../module/mailSender.js')

const crypto = require('crypto-promise');
const db = require('../../module/pool.js');
const redis = require('../../module/redis');
const uuidv3 = require('uuid/v3');
const MY_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341'; // 이메일 유효성 검사 시 사용
//회원가입
router.post('/', async (req, res) => {
    let user_data = {
        user_id : req.body.user_id,
        user_pwd : req.body.user_pwd,
        user_name : req.body.user_name,
        user_salt : ''
    }
    if (!user_data.user_id || !user_data.user_pwd || !user_data.user_name) {
        res.send( {
            message : "NULL Value"
        });
    } else {
        //입력받은 user_id가 원래 있는지 검사
        let selectQuery = 'SELECT COUNT(*) count FROM user WHERE user_id = ?';
        let selectResult = await db.queryParam_Arr(selectQuery, [user_data.user_id]);

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
            //user_salt값 생성
            const salt = await crypto.randomBytes(32);
            //pw encryption
            const pwHashed = await crypto.pbkdf2(user_data.user_pwd, salt.toString('base64'), 10000, 32, 'sha512');
            user_data.user_salt = salt.toString('base64');
            user_data.user_pwd = pwHashed.toString('base64');
            //이메일 인증 시 사용할 코드 생성
            const emailCode = uuidv3(user_data.user_id, MY_NAMESPACE);
            //redis에 user 값 넣기 (expire 1시간으로 지정)
            await redis.set(emailCode,JSON.stringify(user_data),1, 3600);
           
            var mailOptions = {
                to : user_data.user_id,
                url : 'http://' + req.get('host')+'/users/emailverify/'+emailCode
            };
            mailSender.sendGmail(mailOptions).then(function(result){
                console.log(result);
                res.send({
                    message : '인증을 위해 이메일을 확인하세요 !'
                });
            }).catch(error => {
                console.log(error);
                res.send({
                    message : error
                })
            });
        }
    }
});

module.exports = router;