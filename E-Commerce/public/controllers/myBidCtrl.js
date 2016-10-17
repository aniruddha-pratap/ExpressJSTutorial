angular
	.module('app')
	.controller('myBidCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){
		$scope.items = [];
		$scope.cartItems = [];
		$scope.message="";
		$http({
			method : 'GET',
			url : '/myBid',
			
		}).success(function(data) {
			//checking the response data for statusCode
			console.log(data);
			console.log(data.statusCode);
			if(data.statusCode == "200"){
				for(var i =0;i<data.product.length;i++){
					var pushedItem = {};
					console.log(data.product[i].product);
					pushedItem.name = data.product[i].product;
					pushedItem.info = data.product[i].sellerInfo;
					pushedItem.date = data.product[i].date;
					pushedItem.price = data.product[i].baseprice;
					pushedItem.bidprice = data.product[i].bidprice;
					pushedItem.serial = i+1;
					$scope.items.push(pushedItem);
				}
			}
			
		});
		
	
		
	}]);