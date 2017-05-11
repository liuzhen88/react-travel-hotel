let validate=
{
	checkMobile: function(phone) { //匹配手机号码
			var pattern = /^1[34578]\d{9}$/;
			return pattern.test(phone);
		},
		checkNum: function(num) {
			var pattern = /\d+$/;
			return pattern.test(num);
		}
}

export default validate;