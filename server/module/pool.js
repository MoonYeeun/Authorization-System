const pool = require('../config/dbPool.js');

module.exports = {	// 두 개의 메소드 module화
	queryParam_None : async (...args) => {	
		const query = args[0];
		let result;

		try {
			var connection = await pool.getConnection(); // connection을 pool에서 하나 가져온다.			
			result = await connection.query(query) || null;	// query문의 결과 || null 값이 result에 들어간다.
		} catch(err) {
			next(err);
		} finally {
			pool.releaseConnection(connection);	// waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
			return result;
		}

	}, //회원가입
	queryParam_Arr : async (...args) => {
		const query = args[0];
		const value = args[1];	// array
		let result;

		try {
			var connection = await pool.getConnection();			
			result = await connection.query(query, value) || null;	
		} catch(err) {
			next(err);
		} finally {
			pool.releaseConnection(connection);	// waterfall 에서는 connection.release()를 사용했지만, 이 경우 pool.releaseConnection(connection) 을 해준다.
			return result;
		}
	}
};