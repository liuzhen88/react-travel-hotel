import config from './config';
import apiconfig from './apiconfig';
import jquery from './jquery';
import {createHashHistory} from 'history';

const history = createHashHistory();

(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
		recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (clientWidth > 750) {
				clientWidth = 750;
			}
			if (!clientWidth) return;
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px'; //100盲赂潞忙鈥澛久ヂぢ♀€灻モ偓聧忙鈥⒙盲赂潞盲潞鈥犆ぢ柯澝伱ㄆ捖矫ヂづ该βＣ÷悸┟︹€澛久寂抯ass茅鈥∨捗┞澛⒚ヂ库€γ┞÷幻ヂ姑ヅ脚该棵ヂ奥好ヂ该悸┟ヂ0氓鈧
		};
	if (!doc.addEventListener) return;
	win.addEventListener(resizeEvt, recalc, false);
	doc.addEventListener('DOMContentLoaded', recalc, false);
	recalc();
	//alert(docEl.style.fontSize);
})(document, window);

let app = {
	initParam: {
			Version: '1.0.6',
			MemberId: '',
			MemberMac: 'chuguofanyiguan',
			PlatId: "1005",
			RefId: "116",
			Token:''
	},
	initRequestParam:function()
	{
		var setting =app.getSettings();
		app.initParam.MemberId=setting.MemberId;
		app.initParam.Token=setting.Token;
		return app.initParam;
	},
	setSettings: function(settings) {
			settings = settings || {};
			localStorage.removeItem('$settings');
			localStorage.setItem('$settings', JSON.stringify(settings));
		},
		getSettings: function() {
			var settingsText = localStorage.getItem('$settings') || "{}";
			return JSON.parse(settingsText);
		},
		SerializeJson: function(self) {
			var o = {};
			var getClass = function(obj) {
				return Object.prototype.toString.call(obj).match(/^\[object\s(.*)\]$/)[1];
			};
			var init = function(value, name) {
				if(getClass(value) == "Object") {
					for(var xtem in value) {
						if(name == null) {
							init(value[xtem], xtem.toString());
						} else {
							init(value[xtem], name + "." + xtem.toString());
						}
					}
				} else if(getClass(value) == "Number" || getClass(value) == "String" || getClass(value) == "Boolean") {
					o[name] = value;
				} else if(getClass(value) == "Array") {
					for(var i = 0; i < value.length; i++) {
						init(value[i], name + "[" + i + "]");
					}
				}
			};
			init(self);
			return o;
		},
		GetSerializeJson: function(self) {
			var json = eval('('+(JSON.stringify(self)+JSON.stringify(app.initRequestParam())).replace(/}{/,',')+')');
			return app.SerializeJson(json);
		},
	/*
		url 猫炉路忙卤鈥毭♀€灻仿р€
		data 猫炉路忙卤鈥毭♀€灻ヂ忊€毭︹€
		callback 氓鈥号久捌捗モ€÷矫︹€⒙
	*/
	Post: function (method,data,callback){
		var settings = app.getSettings();
		let requestUrl = config.serverUrl + method;
		//console.log(JSON.stringify(app.GetSerializeJson(data)));
		$.ajax({
			url: requestUrl,
			data: app.GetSerializeJson(data),
			dataType: 'json', //忙艙聧氓艩隆氓鈩⒙库€澝モ€号緅son忙聽录氓录聫忙鈥⒙懊β嵚
			type: 'Post', //HTTP猫炉路忙卤鈥毭甭幻ヅ锯€
			timeout: 20000, //猫露鈥γ︹€斅睹︹€斅睹┾€斅疵久铰ぢ该р€櫭尖€
			success: function(data) {
				if(data.Code == "8001" || data.Code == "8000") {
					const location = history.location;
					//history.push(location.pathname);
					history.replace('/login');
				}else{
					if(callback){
						callback(data);
					}
				}
			},
			error:function(xhr, type, errorThrown){

			}
		});
	},

	// 氓聫鈥樏┾偓聛忙艙陋莽鈩⒙幻ヂ解€⒚ζ掆€γモ€犅得ぢ糕€姑♀€灻┞捗伱
	// phone茂录忙沤楼忙鈥澛睹︹€扳€姑ε撀好ヂ
	// type 茂录氓聫鈥樏┾偓聛莽卤禄氓啪 1 氓驴芦忙聧路莽鈩⒙幻ヂ解€ 2 忙鲁篓氓鈥犈 
	SendNoLoginSMSCode: function(phone,type,callback) { //氓聫鈥樏┾偓聛茅陋艗猫炉聛莽聽聛
		let requestdata={"phone" : phone ,"sendtype" : type};
		app.Post(apiconfig.SendNoLoginSMSCode,requestdata,callback);
	},
	GetResultState: function(data) {
			if(data != undefined && data != null && data.Code == '0000') {
				return true;
			} else {
				return false;
			}
		},

	showMsg:function(msg){
		iqwerty.toast.Toast(msg);
	},
	ToMain:function()
	{
		window.location.hash = '#'
	},
	//楠岃瘉鏄惁鐧诲綍
	checkLogin:function()
	{
		var settings = app.getSettings();
		if(!(!!settings.Token && !!settings.MemberId))
		{
			window.location.hash = '#login';
		}
	},
	DateAdd: function(strInterval, Number, dateStr) {
		var dtTmp = dateStr;
		switch(strInterval) {
			case 's':
				return new Date(Date.parse(dtTmp) + (1000 * Number));
			case 'n':
				return new Date(Date.parse(dtTmp) + (60000 * Number));
			case 'h':
				return new Date(Date.parse(dtTmp) + (3600000 * Number));
			case 'd':
				return new Date(Date.parse(dtTmp) + (86400000 * Number));
			case 'w':
				return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
			case 'q':
				return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			case 'm':
				return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
			case 'y':
				return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
		}
	},
	MaxDayOfDate: function(dateStr) {
		var myDate = dateStr;
		var ary = this.DatetoArray(myDate);
		var month = parseInt(ary[1], 10);
		var d = new Date(ary[0], ary[1], 0);
		return d.getDate();
	},
	DatetoArray: function(dateStr) {
		var myDate = new Date(dateStr);
		var myArray = Array();
		myArray[0] = myDate.getFullYear();
		myArray[1] = myDate.getMonth() + 1;
		myArray[2] = myDate.getDate();
		myArray[3] = myDate.getHours();
		myArray[4] = myDate.getMinutes();
		myArray[5] = myDate.getSeconds();
		return myArray;
	},
	DatePart: function(interval, datestr) {
		var myDate = new Date(datestr);
		var partStr = '';
		var Week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
		switch(interval) {
			case 'y':
				partStr = myDate.getFullYear();
				break;
			case 'm':
				partStr = myDate.getMonth() + 1 < 10 ? "0" + (myDate.getMonth() + 1) : myDate.getMonth() + 1;
				break;
			case 'd':
				partStr = myDate.getDate() < 10 ? "0" + myDate.getDate() : myDate.getDate();
				break;
			case 'w':
				partStr = Week[myDate.getDay()];
				break;
			case 'ww':
				partStr = myDate.WeekNumOfYear();
				break;
			case 'h':
				partStr = myDate.getHours();
				break;
			case 'n':
				partStr = myDate.getMinutes();
				break;
			case 's':
				partStr = myDate.getSeconds();
				break;
		}
		return partStr;
	},
	daysBetween: function(DateOne, DateTwo) {
		var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
		var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
		var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

		var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
		var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
		var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

		var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
		return Math.abs(cha);
	},
	countTime:function(startTime, endTime){
		var startMonth = this.DatePart('m',startTime);
		var startDay = this.DatePart('d',startTime);
		var startWeek = this.DatePart('w',startTime);

		var endMonth = this.DatePart('m',endTime);
		var endDay = this.DatePart('d',endTime);
		var endWeek = this.DatePart('w',endTime);

		var count = this.daysBetween(startTime, endTime) + 1;
		return {
			startMonth:startMonth,
			startDay:startDay,
			endMonth:endMonth,
			endDay:endDay,
			startWeek:startWeek,
			endWeek:endWeek,
			count:count
		}
	},
	getCloneObject:function(data){
		var newData = {};
		for(var key in data){
			newData[key] = data[key];
		}
		return newData;
	},
	handleEndPlaceData:function(result, historyData){
		result.forEach(function(value, index){
			result[index].isSelect = 0;
			historyData.forEach(function(list){
				if(value.Id == list.Id){
					result[index].isSelect = 1;				}
			});
		});
		return result;
	},
	isEmptyObject:function(obj){
		return $.isEmptyObject(obj);
	},
	getLocalStore:function(){
		var localData = localStorage.getItem('store') || "{}";
		localData = JSON.parse(localData);
		return localData;
	},
	setLocalStore:function(data){
		data = data || {};
		localStorage.setItem('store', JSON.stringify(data));
	},
	getMoneyCode:function(moneycode)
	{
		switch(moneycode) {
			case "&yen;":
			 return "￥";
		}
	}
}

export default app;