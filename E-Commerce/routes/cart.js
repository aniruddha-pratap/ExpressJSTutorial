var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var winston = require('winston');

/* GET home page. */
router.get('/', function(req, res, next) {
	var json_responses = '';
	if(req.session.username){
		var getCart = "Select * from cart where addedBy = '"+req.session.username+"'";
		mysql.fetchData(function(err, results){
			if(err){
				throw err;
				
			}
			else{
				if(results.length>0){
					json_responses = {'cart': results, statusCode: '200'};
					res.send(json_responses);
				}else{
					json_responses = {statusCode: '400'};
					res.send(json_responses);
				}
			}
		},getCart);
	}else{
		json_responses = {statusCode: '401'};
		res.send(json_responses);
	}
	
});

router.post('/', function(req, res, next) {
		var json_responses = '';
		var username = req.session.username;
		console.log(username);
	    var getProduct="select * from products where p_id = '"+req.param("id")+"'";
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length >0){
				var prodAvailQuantity = results[0].quantity;
				console.log("Prod Qty"+prodAvailQuantity);
				if(prodAvailQuantity > 0){
					var prodExists = "UPDATE cart SET quantity = quantity + 1 where productId = '"+results[0].p_id+"' AND addedBy = '"+ req.session.username +"'";
					var searchCart = "Select product, quantity from cart where productId = '"+results[0].p_id+"' AND addedBy = '"+ req.session.username +"'";
					var cartItem = "INSERT INTO cart (product, quantity, price, addedBy, productId) values ('" + results[0].name + "','" + '1' + "','" + results[0].price + "','" + username + "','" + results[0].p_id+"')";
					mysql.fetchData(function(err,rows){
						if(err){
							throw err;
						}
						else{
							if(rows.length>0){
								var prodCartQuantity = rows[0].quantity;
								console.log('Cart Quantity:' + prodCartQuantity);
								if(prodCartQuantity < prodAvailQuantity){
									mysql.fetchData(function(err,results){
										if(err){
											throw err;
										}else{
											json_responses = {'statusCode': 200};
											res.send(json_responses);
										}
									},prodExists);
								}else{
									json_responses = {'statusCode': 400, 'error':'Maximum quantity available!'};
									console.log('Sold Out');
									res.send(json_responses);
								}
							}else{
								mysql.fetchData(function(err,results){
									if(err){
										throw err;
									}
									else{
										json_responses = {'statusCode': 200};
										res.send(json_responses);
									}
								},cartItem);
							}
						}
					},searchCart);
				}
				else{
					json_responses = {'statusCode': 400, 'error':'Selected product is sold out'};
					console.log('Sold Out');
					res.send(json_responses);
				}
			}
			else{
				json_responses = {'statusCode': 400};
				res.send(json_responses);
			}
		}	  
	},getProduct);

		winston.debug("Add Items to cart for User: "+req.session.username+" Product Id: "+req.param("id"));
		
	});

module.exports = router;
