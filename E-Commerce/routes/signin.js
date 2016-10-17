var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var winston = require('winston');
var crypto = require('crypto');
var key = '6789';

router.post('/', function(req, res, next){
	var json_response = '';
	var passEntered = req.param("password");
	var enteredPassword = crypto.createHmac('sha1', key).update(passEntered).digest('hex');
	var getUser= "select lastlogged,username, password from users where username='"+req.param("username")+"' AND password ='"+enteredPassword+"'";
	console.log("Query is:"+getUser);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log('Pass from DB' + results[0].password);
				req.session.username = req.param("username");
				req.session.lastlogged = results[0].lastlogged;
				var date = new Date();
				console.log(date);
				var inputDate = "update users set lastlogged = '"+date+"' where username='"+req.param("username")+"'";
				mysql.fetchData(function(err,rows){
					if(err){
						throw err;
					}
					else{
						json_response = {'username': req.session.username, 'statusCode': '200'};
				        res.send(json_response);	
					}
				},inputDate);
		    }
			else{
				json_response = {'statusCode': '400','error':'Username or Password is not correct'};
				res.send(json_response);
			}
		}
	},getUser);
	winston.debug("Signin for User: "+req.param("username"));
});

module.exports = router;
