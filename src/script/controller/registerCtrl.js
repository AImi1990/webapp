'use strict';
angular.module('app').controller('registerCtrl',['$interval','$http','$state','$scope',function($interval,$http,$state,$scope){
	$scope.submit = function(){
		//点击注册按钮时调用$http.post
		$http.post('data/regist.json',$scope.user).success(function(resp){
			//注册成功以后跳转到登陆页面
			$state.go('login');
		});
	};
	var count = 60;
	$scope.send = function(){
		$http.get('data/code.json').success(function(resp){
			if(1===resp.state){ //状态返回为1，表示发送成功
				count = 60;
				$scope.time = '60s';
				var interval = $interval(function(){
					if(count<=0) { //如果<=0则取消循环
						$interval.cancel(interval);
						$scope.time = '';					
					} else {
						count--;
						$scope.time = count + 's';						
					}
				},1000)
			}
		});
	}
}]);