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