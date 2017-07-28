'use strict';
//登陆信息都是缓存在cache服务里面，所以先注入cache
angular.module('app').controller('meCtrl',['cache','$state','$http','$scope',function(cache,$state,$http,$scope){
	//首先判断登录状态有没有登陆
	if(cache.get('name')) { //如果有name的话就是登陆的
		//将name,image赋值
		$scope.name = cache.get('name');
		$scope.image = cache.get('image');
	}
	//设置退出登录按钮
	$scope.logout = function() {
		//先把存到cookie里面的数据删除,再做跳转到首页
		cache.remove('id');
		cache.remove('name');
		cache.remove('image');
		$state.go('main');
	};
}]);