const mysql=require('mysql');
//const mysql=require('promise-mysql');

const dbConfig={
	host:'localhost',
	port:3306,
	user:'root',
	password:'gozldwmfrjwldi',
	database:'auth',
	connectionLimit:20
};

module.exports=mysql.createPool(dbConfig);