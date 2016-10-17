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
	var json_responses = '';
	var getUser="select * from users where username='"+req.param("username")+"'";
	console.log("Query is:"+getUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Invalid Login");
				json_responses = {'statusCode': '400'};
				res.send(json_responses);
			}
			else {    
				console.log("Valid Login");
				var username = req.param("username");
				var firstName = req.param("firstname");
				var lastName = req.param("lastname");
				var passwordToSave = crypto.createHmac('sha1', key).update(req.param("password")).digest('hex');
				//var passwordToSave = bcrypt.hashSync(req.param("password"), salt);
				console.log("Password to save: "+ passwordToSave);
				var newUser = "INSERT INTO users (firstName,lastName,username,password) values ('" + firstName + "','" + lastName + "','" + username + "','" + passwordToSave +"')";
				mysql.fetchData(function(err, results){
					if(err){
						throw err;
					}
					else{
						req.session.username = username;
						json_responses = {'username': req.session.username, 'statusCode': '200'};
						res.send(json_responses);
					}
				}, newUser);
			}
		}  
	},getUser);

	winston.debug("Signup for User: "+req.param("username"));
});


module.exports = router;
