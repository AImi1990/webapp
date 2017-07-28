'use strict';
angular.module('app').controller('positionCtrl',['$log','$q','$http','$state','$scope','cache',
	function($log,$q,$http,$state,$scope,cache){
	$scope.isLogin = !!cache.get('name');
	$scope.message = $scope.isLogin?'投个简历':'去登录';
	function getPosition(){
		var def = $q.defer(); //创建延迟对象
		//异步函数
		$http.get('/data/position.json',{
			params: {
				id:$state.params.id
			}
		}).success(function(resp){
			$scope.position = resp;
			if(resp.posted) {
				$scope.message = '已投递';
			}
			def.resolve(resp);
		}).error(function(err){
			def.reject(err);
		});
		return def.promise;//返回defer对象的promise属性，也是一个对象
	};
	function getCompany(id){
		$http.get('data/company.json?id='+id).success(function(resp){
			$scope.company = resp;
		})
	};
	getPosition().then(function(obj){
		getCompany(obj.companyId);
	});
	$scope.go = function() {
		if($scope.message !== '已投递') {
			if($scope.isLogin) {
				$http.post('data/handle.json', {
					id: $scope.position.id
				}).success(function(resp) {
					$log.info(resp);
					$scope.message = '已投递';
				});
			} else {
				$state.go('login');
			}
		}
	}
}]);