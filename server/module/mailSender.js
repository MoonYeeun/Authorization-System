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
                user : 'ggyeeungg95@gmail.com',
                pass : '1226mye!'
            }
        });
        console.log(param.toEmail);
        //메일 옵션
        var message = {
            to : param.toEmail, //수신할 이메일
            subject : param.subject, //메일 제목
            html : param.html //메일 내용
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
//메일 객체 exports
module.exports = mailSender;