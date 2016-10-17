var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

router.get('/', function(req,res,next){
	var json_responses = '';
	var getUser= "select * from users where username='"+req.session.username+"'";
	mysql.fetchData(function(err, results){
		if(err){
			throw err;
		}else{
			if(results.length>0){
				json_responses = {'statusCode': '200', 'user': results};
				res.send(json_responses);
			}else{
				json_responses = {'statusCode': '400'};
				res.send(json_responses);
			}
		}
	},getUser);
});

router.post('/', function(req, res, next){
	var json_responses = '';
	var updateUser="UPDATE users SET firstName = '"+req.param("firstname")+"',lastName = '"+req.param("lastname")+"',cellnumber = '"+req.param("phoneNumber")+"',dob ='"+req.param("dob")+"',address = '"+req.param("address")+"' WHERE username ='"+req.session.username+"'"; 
	console.log("Query is:"+updateUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
			json_responses = {'statusCode': '400', 'error': 'Snap! Something went wrong'};
			res.send(json_responses);
		}
		else 
		{
			json_responses = {'statusCode': '200', 'error': 'Updated Succesfully!'};
			res.send(json_responses);
		}	
	}, updateUser);
});


module.exports = router;
