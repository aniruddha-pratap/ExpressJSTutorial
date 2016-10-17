var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');
var bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(10);
var winston = require('winston');

router.get('/', function(req,res,next){
	var json_response = '';
	var getProduct = "select * from products where sellerInfo != '"+req.session.username+"' AND type = 'bidding' AND timestampdiff(day, date, now()) < 4";
	console.log("Query is:"+getProduct);
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Products found");
				json_response = {'product': results, 'statusCode': '200', 'username':req.session.username};
				res.send(json_response);
			}
			else{
				json_response = {'statusCode': '400'};
				res.send(json_response);
			}
		}
	},getProduct);
});

router.post('/', function(req, res, next){
	var json_response = '';
	console.log(req.param("bidAmount"));
	var getProduct = "select * from products where p_id = '"+req.param("id")+"'";
	console.log("Query is:"+getProduct);
	if(req.param("bidAmount") != '0'){
		mysql.fetchData(function(err,results){
			if(err){
				throw err;
			}
			else 
			{
				if(results.length > 0){
					console.log("Products found");
					var seacrhBid = "select * from biddingdetails where productId = '"+req.param("id")+"' AND bidowner = '"+req.session.username+"'";
					mysql.fetchData(function(err,rows){
						if(err){
							throw err;
						}else{
							if(rows.length > 0){
								var updateBid = "update biddingdetails set bidprice ='"+req.param("bidAmount")+"'";
								mysql.fetchData(function(err,rows){
									if(err){
										throw err;
									}else{
										json_response = {'statusCode': '200', 'error':'Bid Posted Successfully!'};
										res.send(json_response);
									}
								},updateBid);
							}
							else{
								var addBid = "INSERT into biddingdetails (product,productId,baseprice,sellerInfo,bidowner,bidprice) values ('"+results[0].name+"','"+req.param("id")+"','"+results[0].price+"','"+results[0].sellerInfo+"','"+req.session.username+"','"+req.param("bidAmount")+"')";
								mysql.fetchData(function(err,rows){
									if(err){
										throw err;
									}
									else{
										json_response = {'statusCode': '200', 'error':'Bid Posted Successfully!'};
										res.send(json_response);
									}
								},addBid);
							}
						}
					},seacrhBid);
				}
				else{
					json_response = {'statusCode': '400','error':''};
					res.send(json_response);
				}
			}
		},getProduct);
	}
	else{
		json_response = {'statusCode': '400','error':'Please provide the bid amount'};
		res.send(json_response);
	}
	winston.debug("Bidding User: "+req.session.username+" Bidding Amount: "+req.param("bidAmount")+" Product Id: "+req.param("id"));
});

module.exports = router;
