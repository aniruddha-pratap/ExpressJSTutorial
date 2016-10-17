var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('calculator');
});

router.post('/', function(req, res, next) {
	var result = '';
	var error = '';
	var json_response = '';
	var oldValue = req.param("oldValue");
	var newValue = req.param("newValue");
	var operator = req.param("operator");
	if(operator == '+'){
		result = Number(oldValue) + Number(newValue);
	}
	if(operator == '-'){
		if(Number(oldValue) > Number(newValue)){
			result = Number(oldValue) - Number(newValue);
		}else{
			error = "First Number should be greater than the second";
		}
	}
	if(operator == '*'){
		result = Number(oldValue) * Number(newValue);
	}
	if(operator == '/'){
		if(newValue != '0'){
			result = Number(oldValue) / Number(newValue);
		}else{
			error="You cannot divide by zero";
		}
	}
	if(error != ''){
		json_response = {'statusCode': '400', 'error': error};
		res.send(json_response);
	}else{
		json_response = {'statusCode': '200', 'result': result};
		res.send(json_response);
	}
});

module.exports = router;
