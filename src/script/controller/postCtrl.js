'use strict';
angular.module('app').controller('postCtrl',['$http','$state','$scope',function($http,$state,$scope){
	$scope.tabList = [{
		id: 'all',
		name: '全部'
	},{
		id: 'pass',
		name: '面试邀请'
	},{
		id: 'fail',
		name: '不合适'
	}];
	//调用接口myPost.json
	$http.get('data/myPost.json').success(function(res){
		$scope.positionList = res;
	});
	//点击导航进行过滤
	$scope.filterObj = {};
	$scope.tClick = function(id,name) {
		switch (id) {
			case 'all':
				delete $scope.filterObj.state;
				break;
			case 'pass':
				$scope.filterObj.state = '1';
				break;
			case 'fail':
				$scope.filterObj.state = '-1';
				break;
			default:
		}
	}
}]);