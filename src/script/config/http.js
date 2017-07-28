'use strict';
angular.module('app').config(['$provide',function($provide){
	/*
		修改$http服务
		$delegate这个服务指代前面带修饰的服务，现在指代的是$http服务
		$q：因为http请求是一个异步的操作，$q专门处理异步操作
	*/
	$provide.decorator('$http',['$delegate','$q',function($delegate,$q){
		/*
			修改思路：把post请求改为get请求，同时返回一个正确的参数即返回我们json文件里的值
		*/
		$delegate.post = function(url,data,config) {
			//创建延迟对象
			var def = $q.defer();
			$delegate.get(url).success(function(resp) {
				//结果返回来以后进行resolve操作
				def.resolve(resp);
			}).error(function(err) {
				//结果异常就返回去
				def.reject(err);
			});
			return {
				success: function(cb){
					//当resolve执行完以后执行调用cb
					def.promise.then(cb);
				},
				error: function(cb){
					//错误的时候执行错误的回调函数
					def.promise.then(null,cb);
				}
			}
		}
		return $delegate; //修改完服务以后一定记得要return回去，否则什么也没有报错
	}]);
}]);