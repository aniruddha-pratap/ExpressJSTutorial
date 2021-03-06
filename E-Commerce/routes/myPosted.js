var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var winston = require('winston');


router.post('/', function(req, res, next){
	var json_response = '';
	var getProduct = "select * from products where sellerInfo = '"+req.session.username+"' AND type = 'new'";
	console.log("Query is:"+getProduct);
	if(req.session.username){
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("Products found");
					json_response = {'product': results, 'statusCode': '200'};
					res.send(json_response);
				}
				else{
					json_response = {'statusCode': '400'};
					res.send(json_response);
				}
			}
		},getProduct);
	}else{
		json_response = {'statusCode': '400'};
		res.send(json_response);
	}
	winston.debug("Posted for User: "+req.session.username);
});

module.exports = router;
