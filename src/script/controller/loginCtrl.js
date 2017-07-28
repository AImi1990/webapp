'use strict';
angular.module('app').controller('loginCtrl',['cache','$http','$state','$scope',function(cache,$http,$state,$scope){
	//填写submit函数
	$scope.submit = function() {
		$http.post('data/login.json',$scope.user).success(function(resp){
			/*
				跳转页面之前先缓存，再跳转到首页
				缓存用到的cache服务
			*/
			cache.put('id',resp.id);
			cache.put('name',resp.name);
			cache.put('image',resp.image);
			$state.go('main');
		});
	}
}]);