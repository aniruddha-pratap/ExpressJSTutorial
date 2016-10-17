var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);

router.post('/', function(req, res, next){
	var json_responses = '';
	console.log(req.session.username);
	var addProduct="INSERT into products(name,description,price,quantity,sellerInfo,type) values ('" + req.param("name") + "','" + req.param("description") + "','" + req.param("price") + "','" + req.param("quantity") + "','" + req.session.username +"','bidding')";
	console.log("Query is:"+addProduct);
	
	if(req.session.username){
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
				json_responses={'statusCode': '400', 'error':'Snap!Something went wrong'};
				res.send(json_responses);
			}
			else 
			{
				json_responses={'statusCode': '400', 'error':'Posted Successfully'};
				res.send(json_responses);
			}  
		},addProduct);
	}
	else{
		json_responses={'statusCode': '400', 'error':'You are not signed in'};
		res.send(json_responses);
	}
	
});


module.exports = router;
