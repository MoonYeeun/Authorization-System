var express = require('express');
var router = express.Router();
var mailSender = require('../../module/mailSender.js')
var fs = require('fs'); //파일 로드 사용
var Styliner = require('styliner');
//redis 접속
var redis = require('redis');
var client = redis.createClient(6379,'127.0.0.1');

const crypto = require('crypto-promise');
const db = require('../../module/pool.js');
//이메일 인증
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
            //user_salt값 생성
            const salt = await crypto.randomBytes(32);
            //pw encryption
            const pwHashed = await crypto.pbkdf2(user_data.user_pwd, salt.toString('base64'), 10000, 32, 'sha512');
            user_data.user_salt = salt.toString('base64');
            user_data.user_pwd = pwHashed.toString('base64');
            //이메일 인증 시 사용할 코드 생성
            var key= await crypto.randomBytes(256); // 100번째부터 5자
            var key_one = key.toString('hex').substr(100,5);
            var key_two= key.toString('base64').substr(50,5); //50번째부터 5자 
            var key_for_verify= await key_one+key_two;
            console.log('verify key : ' , key_for_verify);
            //redis에 user 값 넣기 (expire 1시간으로 지정)
            client.setex(key_for_verify,3600,JSON.stringify(user_data));
             //url
            var url = 'http://' + req.get('host')+'/users/emailverify/'+key_for_verify;
            //var emailForm = await fs.readFileSync('/Users/yeeun/authSystem/server/views/emailForm.html', 'utf8');
            let mailOptions = {
                toEmail : user_data.user_id,
                subject : '이메일 인증을 진행해주세요.',
                html : '<h1>이메일 인증을 위해 URL을 클릭해주세요.</h1><br>' + 
                '<a href ="'+url+'">'+url+'</a>'
                //html : emailForm
            };
            await mailSender.sendGmail(mailOptions).then(function(result){
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