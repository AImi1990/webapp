'use strict';
angular.module('app').controller('favoriteCtrl',['$http','$state','$scope',function($http,$state,$scope){
	$http.get('data/myFavorite.json').success(function(resp) {
		$scope.list = resp;
	});
}]);