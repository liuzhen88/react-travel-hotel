/*
	author:刘振
	time:2017-05-06
	参数说明：
		nowDate					当前时间 									必传
		limitHour				小时限制，用于设置日历是否向后跳1天			非必传	默认值	18
		defaultStartEndSkip		开始时间和结束时间为空时开始结束时间间隔	非必传	默认值	5
		beforeLimitHourSkip		在限制小时之前开始时间天数的增加量			非必传	默认值	1
		afterLimitHourSkip		在限制小时之后开始时间天数的增加量			非必传	默认值	2
		totalMonth				日历组件显示几个月的时间					非必传	默认值	3
		startText				日历组件开始时间备注						非必传	默认值	出
		endText					日历组件结束时间备注						非必传	默认值	返
		startTime				日历组件默认显示的开始时间					非必传	默认值	当前时间是否过18点？当前时间加1天：当前时间加2天
		endTime 				日历组件默认显示的结束时间					非必传	默认值	当前时间是否过18点？当前时间加5天：当前时间加5天
		confirmCallback 		日历组件选择确定后的回调					非必传
		previewCallback			日历组件选择了开始和结束但未确认前的回调	非必传

*/

import React from 'react';
import app from '../config/public';

let storeTime = [];

let CalendarTable = React.createClass({
	getInitialState() {
		let nextTimeData = this.getNextMonthData();

		let limitHour = this.props.limitHour ? Number( this.props.limitHour ) : 18;
		let defaultStartEndSkip = this.props.defaultStartEndSkip ? Number(this.props.defaultStartEndSkip) : 5;
		let beforeLimitHourSkip = this.props.beforeLimitHourSkip ? Number( this.props.beforeLimitHourSkip ) : 1;
		let afterLimitHourSkip = this.props.afterLimitHourSkip ? Number( this.props.afterLimitHourSkip ) : 2;
		let nowDate = this.props.nowDate;

		let startStr = nowDate;

		let thisHour = nextTimeData[0].thisHour;

		if(thisHour >= limitHour){
			//超过设定的限制时间
			startStr = this.getHandleLimitDate(afterLimitHourSkip,startStr);
			let skip = afterLimitHourSkip + defaultStartEndSkip - 1;
			var startTime = this.props.startTime ? this.props.startTime : this.initTime(nowDate,afterLimitHourSkip);
			var endTime = this.props.endTime ? this.props.endTime : this.initTime(nowDate,skip);
		}else{
			//未超过
			startStr = this.getHandleLimitDate(beforeLimitHourSkip,startStr);
			let skip = beforeLimitHourSkip + defaultStartEndSkip - 1;
			var startTime = this.props.startTime ? this.props.startTime : this.initTime(nowDate,beforeLimitHourSkip);
			var endTime = this.props.endTime ? this.props.endTime : this.initTime(nowDate,skip);
		}
		return {
			start:startStr,
			startStyle:['td','valid','on','start'],
			endStyle:['td','valid','on','leave'],
			selectStyle:['td','valid','rang'],
			userSelectStart:startTime+' 00:00:00',
			userSelectEnd:endTime+' 00:00:00',
			nextTimeData:nextTimeData,
			thisYear:nextTimeData[0].year,
			thisMonth:nextTimeData[0].month,
			startText:this.props.startText ? this.props.startText : '出',
			endText:this.props.endText ? this.props.endText : '返',
			updateFlag:0
		}
	},
	updateChildren(startTime, endTime){
		this.setState({
			userSelectStart:startTime+' 00:00:00',
			userSelectEnd:endTime+' 00:00:00'
		})
	},
	initTime(nowDate,defaultStartEndSkip){
		let resultTime = app.DateAdd('d',defaultStartEndSkip,nowDate);
		resultTime = resultTime.Format("yyyy-MM-dd");
		return resultTime;
	},
	getHandleLimitDate(num,time){
		let resultTime = app.DateAdd('d',num-1,time);
		resultTime = resultTime.Format("yyyy-MM-dd hh:mm:ss");
		return resultTime;
	},
	confirmSelectDate(){
		let render = this.props.confirmCallback;
		if(render){
			render(this.state.userSelectStart.split(' ')[0],this.state.userSelectEnd.split(' ')[0]);
		}
	},
	getNextMonthData(){
		let that = this;
		let timeArr = [];
		let nowDate = this.props.nowDate;
		nowDate = nowDate.Format("yyyy-MM-dd hh:mm:ss");
		let date = new Date(nowDate);

		let totalMonth = this.props.totalMonth ? Number(this.props.totalMonth) : 3;	

		let thisYear = Number(nowDate.split('-')[0]);
		let thisMonth = Number(nowDate.split('-')[1]);
		let thisMonthMaxDay = app.MaxDayOfDate(nowDate);
		let firstDayStr = new Date(thisYear,thisMonth-1,1);
		let firstDayWeekNum = firstDayStr.getDay();
		let thisHour = date.getHours();

		let thisTime = thisYear + '-' + thisMonth + '-01 00:00:00';
		let monthStr = thisMonth <=9 ? ("0"+thisMonth) : thisMonth;
		let dateList = [];
		for(let jj=1;jj< firstDayWeekNum;jj++){
			dateList.push({
				time:'',
				num:''
			});
		}
		for(let ii=1;ii<=thisMonthMaxDay;ii++){
			let dayStr = ii <= 9 ? ('0'+ii) : ii;
			dateList.push({
				time:thisYear+'-'+monthStr+'-'+dayStr+' 00:00:00',
				num:ii
			});
		}
		timeArr.push({
			year:thisYear,
			month:thisMonth,
			maxDay:thisMonthMaxDay,
			dateList:dateList,
			firstDayWeekNum:firstDayWeekNum,
			thisHour:thisHour
		});
		for(let i=1;i < totalMonth;i++){
			let nextTime = app.DateAdd('m',i,new Date(thisTime));
			let timeInfo = that.getDateInfo(nextTime);
			timeArr.push(timeInfo);
		}
		return timeArr;
	},
	getDateInfo(thisMonthStr){
		let date = new Date(thisMonthStr);
		let maxDay = app.MaxDayOfDate(thisMonthStr);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let firstDayStr = new Date(year,month-1,1);
		let firstDayWeekNum = firstDayStr.getDay();

		let monthStr = month <=9 ? ("0"+month) : month;

		let dateList = [];
		for(let jj=1;jj< firstDayWeekNum;jj++){
			dateList.push({
				time:'',
				num:''
			});
		}
		for(let ii=1;ii<=maxDay;ii++){
			let dayStr = ii <= 9 ? ('0'+ii) : ii;
			dateList.push({
				time:year+'-'+monthStr+'-'+dayStr+' 00:00:00',
				num:ii
			});
		}
		let data = {
			year:year,
			month:month,
			maxDay:maxDay,
			dateList:dateList,
			firstDayWeekNum:firstDayWeekNum
		};
		return data;
	},
	resetStartEndStyle(element,data, state){
		let that = this;
		if(state == true){
			if(element.time != ""){
				//code
				switch(storeTime.length){
					case 0:
						//push
						storeTime.push(element.time);
						that.clearDateSelect(storeTime);
						break;
					case 1:
						//比较push
						if(element.time > storeTime[0]){
							storeTime.push(element.time);
							that.updateDateSelect(storeTime);
							//清空栈
							storeTime = [];
						}
						if(element.time < storeTime[0]){
							let min = element.time;
							let max = storeTime[0];
							storeTime[0] = min;
							storeTime[1] = max;
							that.updateDateSelect(storeTime);
							//清空栈
							storeTime = [];
						}
						break;				
				}
			}
		}
	},
	updateDateSelect(storeTime){
		let endText = this.props.endText ? this.props.endText : '返';
		this.setState({
			userSelectStart:storeTime[0],
			userSelectEnd:storeTime[1],
			startStyle:['td','valid','on','start'],
			endStyle:['td','valid','on','leave'],
			selectStyle:['td','valid','rang'],
			endText:endText
		},function(){
			let previewCallback = this.props.previewCallback;
			if(previewCallback){
				previewCallback(this.state.userSelectStart.split(' ')[0],this.state.userSelectEnd.split(' ')[0]);
			}
		});
	},
	clearDateSelect(storeTime){
		this.setState({
			userSelectStart:storeTime[0],
			startStyle:['td','valid','default-select'],
			endStyle:['td','valid'],
			selectStyle:['td','valid'],
			endText:''
		});
	},
	render(){
		let start = this.state.start;
		let end = this.state.end;
		let userSelectStart = this.state.userSelectStart;
		let userSelectEnd = this.state.userSelectEnd;
		let thisYear = this.state.thisYear;
		let thisMonth = this.state.thisMonth;
		let that = this;
		let j = 1000;
		return (
			<div>
				<div className="thead">
					<div className="th">周一</div>
					<div className="th">周二</div>
					<div className="th">周三</div>
					<div className="th">周四</div>
					<div className="th">周五</div>
					<div className="th">周六</div>
					<div className="th">周日</div>
				</div>
				<div className="calendar_tables">
					{
						this.state.nextTimeData.map(function(list){
							return <div className="calendar_table" key={list.year+''+list.month}>
										<div className="calendar_month">{list.year}年{list.month}月</div>
										<div className="calendar_tbody">
											{
												list.dateList.map(function(item){
													j++
													
													if(item.time < start){
														return <div className="td invalid" key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,false)}>
																	<p className="tdp">
																		<span className="tddate">{item.num}</span>
																	</p>
																</div>
													}else if(item.time >= userSelectStart && item.time <= userSelectEnd){
														if(item.time == userSelectStart){
															return <div className={that.state.startStyle.join(' ') } key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,true)}>
																		<p className="tdp">
																			<span className="tddate">{item.num}</span>
																			<span className="onstatus">{that.state.startText}</span>
																		</p>
																	</div>
														}else if (item.time == userSelectEnd){
															return <div className={that.state.endStyle.join(' ')} key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,true)}>
																		<p className="tdp">
																			<span className="tddate">{item.num}</span>
																			<span className="onstatus">{that.state.endText}</span>
																		</p>
																	</div>
														}else{
															return <div className={that.state.selectStyle.join(' ')} key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,true)}>
																		<p className="tdp">
																			<span className="tddate">{item.num}</span>
																		</p>
																	</div>
														}
													}else{
														if(userSelectStart == item.time){
															return <div className="td valid default-select" key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,true)}>
																		<p className="tdp">
																			<span className="tddate">{item.num}</span>
																			<span className="onstatus">{that.state.startText}</span>
																		</p>
																	</div>
														}else{

															return <div className="td valid" key={item.num+list.year+''+list.month+j} onClick={that.resetStartEndStyle.bind(null,item,list,true)}>
																		<p className="tdp">
																			<span className="tddate">{item.num}</span>
																		</p>
																	</div>
														}
													}
													
												})
											}
										</div>
									</div>
						})
					}
				</div>
				<div className="fix_wrapper">
					<div className="sure_fix" onClick={this.confirmSelectDate}>确认</div>
				</div>

			</div>
		)
	}
});
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

export default CalendarTable;