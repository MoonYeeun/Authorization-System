const redis = require('../module/redis');
const jwt = require('../module/jwt');

// 토큰 유효성 검증 
module.exports = {
    //access token 검증	
    token_verify : async (...args) => {
        const verify = jwt.verify(args[0], args[1]);
  
        return new Promise( async (resolve, reject) => {
            if(verify.user_id){
                try {
                    let result = await redis.exists(verify.user_id, 3);
        
                    if(result !== 0) { // 로그아웃 된 사용자인 경우 
                        resolve ({
                            state: 'fail',
                            message: '유효하지 않은 접근입니다.'
                        });
                    } else {
                        resolve({
                            state: 'success',
                            message: 'Token verified !',
                            user_id : verify.user_id
                        });
                    }
                } catch(err) {
                    reject ({
                        state: 'fail',
                        message: err
                    });
                }
            } else {
                resolve ({
                    state: 'fail',
                    message: verify
                });
            }
        });
    },
    //refresh token 검증
    refreshToken_verify : async (...args) => {
        
        return new Promise( async (resolve, reject) => {
            let result = await redis.get(args[0], 2)
            .catch((err) => {
                reject ({
                    state: 'fail',
                    message: err
                });
            });

            let refresh_verify = jwt.verify(args[1]);

            if(result === args[1] && typeof refresh_verify.key !== 'undefined') {
                let access_token = jwt.sign(args[0]);
                resolve ({
                    state: 'success',
                    message: access_token
                });
            } else {
                console.log('refresh 토큰 이상');
                reject ({
                    state : 'fail',
                    message: 'token is not valid'
                });                          
            }
        });
    }
};