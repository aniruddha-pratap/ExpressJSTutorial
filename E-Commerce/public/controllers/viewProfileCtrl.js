angular
	.module('app')
	.controller('viewProfileCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){
		$http({
			method : 'GET',
			url : '/profile',
		}).success(function(data){
				$scope.fname=data.user[0].firstName;
				$scope.lname=data.user[0].lastName;
				$scope.dob=data.user[0].dob;
				$scope.cnumber=data.user[0].cellnumber;
				$scope.address=data.user[0].address;
		});
	}]);