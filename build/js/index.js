'use strict';

angular.module('app',['ui.router','ngCookies','validation','ngAnimate']);
'use strict';
angular.module('app').value('dict',{}).run(['dict','$http',function(dict,$http){
	$http.get('data/city.json').success(function(resp){
		dict.city = resp;
	});
	$http.get('data/salary.json').success(function(resp){
		dict.salary = resp;
	});
	$http.get('data/scale.json').success(function(resp){
		dict.scale = resp;
	});
}]);
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
'use strict';

angular.module('app').config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
	$stateProvider.state('main',{
		url:'/main',
		templateUrl:'view/main.html',
		controller:'mainCtrl'
	}).state('position',{
		url: '/position/:id',
		templateUrl: 'view/position.html',
		controller: 'positionCtrl'
	}).state('company',{
		url: '/company/:id',
		templateUrl: 'view/company.html',
		controller: 'companyCtrl'
	}).state('search',{
		url: '/search',
		templateUrl: 'view/search.html',
		controller: 'searchCtrl'
	}).state('login',{
		url: '/login',
		templateUrl: 'view/login.html',
		controller: 'loginCtrl'
	}).state('register',{
		url: '/register',
		templateUrl: 'view/register.html',
		controller: 'registerCtrl'
	}).state('me',{
		url: '/me',
		templateUrl: 'view/me.html',
		controller: 'meCtrl'
	}).state('post',{
		url: '/post',
		templateUrl: 'view/post.html',
		controller: 'postCtrl'
	}).state('favorite',{
		url: '/favorite',
		templateUrl: 'view/favorite.html',
		controller: 'favoriteCtrl'
	});
	$urlRouterProvider.otherwise('main');
}]);
'use strict';
angular.module('app').config(['$validationProvider',function($validationProvider){
	//$validationProvider的作用对模块或者服务进行配置
	/*
		1、首先需要一个表达式来校验表单元素的值是不是符合要求
		2、需要一个错误提示
	*/
	var expression = {
		/*
			每一个属性代表一个校验规则,
			后边的值可以是正则表达式，也可以是一个函数,
			这里我们手机号用的正则表达式，密码用的函数
		*/
		phone: /^1[\d]{10}$/, //以1开头后边接十位数字
		password: function(value) {
			var str = value + '';
			return str.length > 5; //值value至少6位
		},
		required: function(value) {
			return !!value; //不能为空
		}

	};
	var defaultMsg = {
		phone: {
			success: '',
			error: '必须是11位手机号'
		},
		password: {
			success: '',
			error: '长度至少6位'
		},
		required: {
			success: '',
			error: '不能为空'
		}
	};
	/*
		3、先配置校验规则setExpression(expression)，
		   再配置提示语setDefaultMsg(defaultMsg)
	*/
	$validationProvider.setExpression(expression).setDefaultMsg(defaultMsg);
}])
'use strict';
angular.module('app').controller('companyCtrl',['$http','$state','$scope',function($http,$state,$scope){
	$http.get('data/company.json?id='+$state.params.id).success(function(resp){
		$scope.company = resp;
	});
}]);
'use strict';
angular.module('app').controller('favoriteCtrl',['$http','$state','$scope',function($http,$state,$scope){
	$http.get('data/myFavorite.json').success(function(resp) {
		$scope.list = resp;
	});
}]);
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
'use strict';
angular.module('app').controller('mainCtrl',['$http','$scope',function($http,$scope){
	$http.get('/data/positionList.json').success(function(resp){
		$scope.list = resp;
	}).error(function(resp){
		alert('Error');
	});	
}]);
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
'use strict';
angular.module('app').controller('searchCtrl',['dict','$http','$scope',function(dict,$http,$scope){
	$scope.name= '';
	$scope.search = function(){
		$http.get('data/positionList.json?name='+$scope.name).success(function(resp){
			$scope.positionList = resp;
		});			
	};
	$scope.search();
	$scope.sheet = {};
	$scope.tabList = [
		{
			id: 'city',
			name: '城市'
		},
		{
			id: 'salary',
			name: '薪水'
		},
		{
			id: 'scale',
			name: '公司规模'
		}
	];
	$scope.filterObj = {};
	var tabId = '';
	$scope.tClick = function(id,name){
		tabId = id;
		$scope.sheet.list = dict[id];
		$scope.sheet.visible = true;
	};
	$scope.sClick = function(id,name){
		// console.log(id,name);
		if(id){
			angular.forEach($scope.tabList,function(item){
				if(item.id===tabId) {
					item.name = name;
				}
			});
			$scope.filterObj[tabId + 'Id'] = id;
		}else{
			delete $scope.filterObj[tabId + 'Id'];
			angular.forEach($scope.tabList,function(item){
				if(item.id===tabId) {
					switch (item.id){
						case 'city':
							item.name = '城市';
							break;
						case 'salary':
							item.name = '薪水';
							break;
						case 'scale':
							item.name = '公司规模';
							break;
						default:
					}
				}
			});			
		}
	}
}]);
'use strict';
angular.module("app").directive('appCompany',[function(){
	return {
		restrict: 'A',
		replace: true,
		scope: {
			com: '=',
		},
		templateUrl:'view/template/company.html'
	};
}]);
'use strict';
angular.module('app').directive('appFoot',[function(){
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/foot.html'
	}
}]);

'use strict';
angular.module('app').directive('appHead',['cache',function(cache){
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/head.html',
		link: function($scope) {
			$scope.name = cache.get('name') || '';
		}
	};
}]);
'use strict';
angular.module('app').directive('appHeadBar',[function(){
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'view/template/headBar.html',
		scope: {
			text: '@'
		},
		link:function($scope){
			$scope.back = function(){
				window.history.back();
			};
		}
	};
}]);
'use strict';
angular.module('app').directive('appPositionClass',[function(){
	return {
		restrict: 'A',
		replace: true,
		scope: {
			com: '='
		},
		templateUrl: 'view/template/positionClass.html',
		link: function($scope){
			$scope.showPositionList = function(idx){
				$scope.positionList = $scope.com.positionClass[idx].positionList;
				$scope.isActive = idx;				
			}
			$scope.$watch('com',function(newVal){
				if(newVal) $scope.showPositionList(0);
			})	
		}
	};
}]);
'use strict';
angular.module("app").directive('appPositionInfo',['$http',function($http){
	return {
		restrict: 'A',
		replace: true,
		templateUrl:'view/template/positionInfo.html',
		scope: {
			isActive: '=',
			isLogin: '=',
			pos: '='
		},
		link: function($scope){
			$scope.$watch('pos',function(newVal) {
				if(newVal){
					$scope.pos.select = $scope.pos.select || false;
					$scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';							
				}
			})
			$scope.favorite = function() {
				$http.post('data/favorite.json', {
					id:$scope.pos.id,
					select: !$scope.pos.select
				}).success(function(resp) {
					$scope.pos.select = !$scope.pos.select;
					$scope.imagePath = $scope.pos.select?'image/star-active.png':'image/star.png';
				})
			}
		}
	};
}]);
'use strict';
angular.module('app').directive('appPositionList',['$http',function($http){
	//增加cache服务判断当前是不是登陆了
	return {
		restrict: 'A',
		replace: true,
		templateUrl:'view/template/positionList.html',
		scope: {
			data: '=',
			filterObj: '=',
			isFavorite: '='
		},
		link: function($scope) {
			// $scope.name = cache.get('name') || '';
			$scope.select = function(item) {
				$http.post('data/favorite.json',{
					id: item.id,
					select: !item.select
				}).success(function(resp){
					item.select = !item.select;
				})
			};
		}
	};
}]);
'use strict';
angular.module('app').directive('appSheet',[function(){
	return {
		restrict: 'A',
		replace :true,
		scope: {
			list: '=',
			visible: '=',
			select: '&'
		},
		templateUrl: 'view/template/sheet.html'
	};
}]);
'use strict';
angular.module('app').directive('appTab',[function(){
	return {
		restrict: 'A',
		replace :true,
		scope: {
			list: '=',
			tabClick: '&'
		},
		templateUrl: 'view/template/tab.html',
		link: function($scope) {
			$scope.click = function(tab) {
				$scope.selectId = tab.id;
				$scope.tabClick(tab);
			};
		} 
	};
}]);
'use strict';
angular.module('app').filter('filterByObj',[function(){
	return function(list,obj) {
		var result = [];
		angular.forEach(list,function(item){
			var isEqual = true;
			for(var e in obj){
				if(item[e]!==obj[e]){
					isEqual = false;
				}
			}
			if(isEqual) {
				result.push(item);
			}
		});
		return result;
	};
}]);
'use strict';
angular.module('app')
.service('cache',['$cookies',function($cookies){
	this.put = function(key,value){
		$cookies.put(key,value);
	};
	this.get = function(key){
		return $cookies.get(key);
	};
	this.remove = function(key){
		$cookies.remove(key);
	};
}]);