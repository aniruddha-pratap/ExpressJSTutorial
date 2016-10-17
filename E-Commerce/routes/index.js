var express = require('express');
var router = express.Router();
var ejs = require("ejs");
var mysql = require('./mysql');

/* GET home page. */
router.get('/', function(req, res, next) {
	var getProducts="select name,description,price,quantity,sellerInfo from products where type = 'new'";
		mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				ejs.renderFile('./views/index.ejs', { data: results } , function(err, result) {
			        // render on success
			        if (!err) {
			            res.end(result);
			        }
			        // render or error
			        else {
			            res.end('An error occurred');
			            console.log(err);
			        }
			    });
			}
		}	  
	},getProducts);
});

module.exports = router;
