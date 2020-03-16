var nodemailer = require('nodemailer');
var inlineCss = require('nodemailer-juice');

//메일 발송 객체
var mailSender = {
    sendGmail : function(param){   
        var transporter = nodemailer.createTransport({
            service : 'gmail',
            prot : 587,
            host : 'smtp.gmail.com',
            secure : false,
            requireTLS : true,
            auth : {
                user : '',
                pass : ''
            }
        });
        console.log(param.to);
        //메일 옵션
        var message = {
            to : param.to, //수신할 이메일
            subject : '이메일 인증을 진행해주세요.', //메일 제목
            html : '<h1>이메일 인증을 위해 URL을 클릭해주세요.</h1><br>' + 
            '<a href ="'+param.url+'">'+param.url+'</a>'
        };
        transporter.use('compile', inlineCss());
        //메일 발송
        let result = transporter.sendMail(message)
            .catch(err => {
                console.log('err '+ err);
            })

        return result; //발송 후 결과 값 전송
    }
}

module.exports = mailSender;