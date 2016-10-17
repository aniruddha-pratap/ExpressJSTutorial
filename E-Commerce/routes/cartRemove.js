var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var winston = require('winston');

router.post('/', function(req, res, next) {
		var json_responses = '';
		var username = req.session.username;
		console.log(username);
		var searchCart = "Select product, quantity from cart where productId = '"+req.param("id")+"' AND addedBy = '"+ req.session.username +"'";
	    var removeProduct="update cart set quantity = quantity - 1 where productId = '"+req.param("id")+"' AND addedBy = '"+ req.session.username +"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
			}
			else{
				if(results.length>0){
					if(results[0].quantity > 0){
						mysql.fetchData(function(err,results){
							if(err){
								throw err;
							}else{
									json_responses = {'statusCode': 200};
									res.send(json_responses);
							}
						},removeProduct);
					}
					else{
						var deleteProduct = "delete from cart where productId = '"+req.param("id")+"' AND addedBy = '"+ req.session.username +"'";
			            mysql.fetchData(function(err, rows){
			              if(err){
			                throw err;
			              }else{
			            	  	json_responses = {'statusCode': 200};
								res.send(json_responses);
			              }
			            }, deleteProduct);
					}
				}
			}
		}, searchCart);
		winston.debug("Decrease quantity from cart for User: "+req.session.username+" for Product Id: "+req.param("id"));
	});

module.exports = router;
