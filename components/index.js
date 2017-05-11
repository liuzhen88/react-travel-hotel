import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import deepcopy from 'deepcopy';
import { Link } from 'react-router';
import styles from '../style/index.css';
import banner1 from '../images/index_banner.png';
import CalendarTable from './calendar_table';
import Title from './title';
import app from '../config/public';
import config from '../config/apiconfig';

let IndexPage = React.createClass({
	getInitialState: function() {
		let ticket = deepcopy(this.props.data.ticket);
		return {
			mobileNumber: "",
			modal:'mask none',
			calendar:"calendar_panel none",
			selectPeopleContainer:'passenger none',
			ticket:ticket,
			initTime:new Date(),
			token:''
		};
	},
	handleControll:function(){
		let isChange = this.props.data.isChange;
		if(isChange == true){
			isChange = false;
		}else{
			isChange = true;
		}
		this.props.dispatch(actions.indexAction.updateIsChange(isChange));
		let localStore = app.getLocalStore();
		localStore.customPackage.isChange =  isChange;
		app.setLocalStore(localStore);
	},
	showSelectCalendar(){
		let customTime = this.props.data.customTime;
		this.setState({
			modal:'mask',
			calendar:"calendar_panel"
		});
		this.props.dispatch(actions.indexAction.selectDateAction(customTime[0],customTime[1],this.props.data));
		this.refs.callChildren.updateChildren(customTime[0],customTime[1]);
	},
	handleConfirmTime(start, end){
		this.setState({
			modal:'mask none',
			calendar:"calendar_panel none"
		});
		this.props.dispatch(actions.indexAction.selectDateAction(start,end,this.props.data));
		let localStore = app.getLocalStore();
		let storeData = this.props.data;
		localStore.customPackage.customTime = [start,end];
		localStore.customPackage.previewTime = storeData.previewTime;
		localStore.customPackage.time = storeData.time;
		app.setLocalStore(localStore);
	},
	handlePreviewTime(start,end){
		this.props.dispatch(actions.indexAction.previewTimeAction(start,end,this.props.data));
	},
	hideModal(){
		this.setState({
			modal:'mask none',
			calendar:"calendar_panel none",
			selectPeopleContainer:'passenger none',
		});
	},
	getEndPlace(place){
		let placeName = '';
		place.map(function(item){
			if(placeName == ''){
				placeName = placeName + item.Name; 
			}else{
				placeName = placeName + ',' + item.Name
			}
		});
		return placeName;
	},
	componentDidMount() {
		let that = this;
		let customTime = this.props.data.customTime;
		app.Post('Common/GetSystemTime',{
			data:{}
		},function(data){
			//获取初始化时间
			if(data.Code == '0000'){
				let time = data.Now;
				if(customTime.length == 0){
					//时间
					let result = that.getCustomTime(time);
					that.props.dispatch(actions.indexAction.selectDateAction(result.start,result.end,that.props.data));	
				}else{
					//加层验证
					let isReload = that.authLocalTime(time,customTime[0]);
					if(isReload == true){
						let result = that.getCountTime(time,customTime[0],customTime[1]);
						that.props.dispatch(actions.indexAction.selectDateAction(result.start,result.end,that.props.data));	
					}else{
						that.props.dispatch(actions.indexAction.selectDateAction(customTime[0],customTime[1],that.props.data));
					}
				}	
			}
		});
		let settings = app.getSettings();
		if(settings.Token){
			this.setState({
				token:settings.token
			});
		}
	},
	getLocation(callback){
		var myCity = new BMap.LocalCity();
		myCity.get(function(result){
			var name = result.name;
			app.Post(config.GetDestinationList,{
				DestReqType:'current',
				DestList:[
					{
						Type:1,
						Id:0,
						Name:name
					}
				]
			},function(data){
				if(data.Code == '0000'){
					let result = data.DestList[0];
					callback(result);
				}
			});
		});
	},
	handleLocation(){
		let that = this;
		let custom = this.props.data;
		this.getLocation(function(result){
			that.props.dispatch(actions.startPlaceAction.updateStartPlace(result,custom));
			let localStore = app.getLocalStore();
			localStore.customPackage.startPlace = that.props.data.startPlace;
			app.setLocalStore(localStore);
		});
	},
	getCountTime(time,localStartTime,localEndTime){
		let newDate = new Date(time);
		let hour = newDate.getHours();
		if( hour < 18 ){
			var diff = app.daysBetween(localStartTime,localEndTime);
			var startTime = app.DateAdd('d',1,newDate);
			var nextTime = app.DateAdd('d',diff+2,newDate);
		}else{
			var diff = app.daysBetween(localStartTime,localEndTime);
			var startTime = app.DateAdd('d',2,newDate);
			var nextTime = app.DateAdd('d',diff+3,newDate);
		}
		let result = nextTime.Format("yyyy-MM-dd");
		let start = startTime.Format("yyyy-MM-dd");
		return {
			start:start,
			end:result
		}
	},
	getCustomTime(time){
		let newDate = new Date(time);
		let hour = newDate.getHours();

		if( hour < 18){
			var startTime = app.DateAdd('d',1,newDate);
			var nextTime = app.DateAdd('d',5,newDate);
		}else{
			var startTime = app.DateAdd('d',2,newDate);
			var nextTime = app.DateAdd('d',6,newDate);
		}

		
		let result = nextTime.Format("yyyy-MM-dd");
		let start = startTime.Format("yyyy-MM-dd");
		return {
			start:start,
			end:result
		}
	},
	authLocalTime(time,localStartTime){
		let newDate = new Date(time);
		let hour = newDate.getHours();
		let isReload = false;
		if(hour < 18){
			//推1天
			let nextTime = app.DateAdd('d',1,newDate).Format("yyyy-MM-dd");
			if(localStartTime < nextTime){
				isReload = true;
			}

		}else{	
			//推2天
			let nextTime = app.DateAdd('d',2,newDate).Format("yyyy-MM-dd");
			if(localStartTime < nextTime){
				isReload = true;
			}
		}
		return isReload;
	},
	showSelectPeople(){
		let ticket = deepcopy(this.props.data.ticket);
		//选择出行人数
		this.setState({
			modal:'mask',
			selectPeopleContainer:'passenger',
			ticket:ticket
		})
	},
	addAdultNum(){
		//成人++
		let ticket = this.state.ticket;
		ticket.adultNum++;
		this.setState({
			ticket:ticket
		})
	},
	reduceAdultNum(){
		//成人--
		let ticket = this.state.ticket;
		if(ticket.adultNum > 3){

			ticket.adultNum --;
			this.setState({
				ticket:ticket
			})
		}
	},
	addChildren(){
		//儿童++
		let ticket = this.state.ticket;
		ticket.childrenNum ++;
		this.setState({
			ticket:ticket
		})
	},
	reduceChildren(){
		let ticket = this.state.ticket;
		if(ticket.childrenNum > 0){
			ticket.childrenNum -- ;
			this.setState({
				ticket:ticket
			})
		}
	},
	confirmPeople(){
		//确认人数
		let ticket = this.state.ticket;
		this.props.dispatch(actions.indexAction.updateSelectPeople(ticket));
		this.setState({
			modal:'mask none',
			selectPeopleContainer:'passenger none',
		});
		//更新缓存
		let localStore = app.getLocalStore();
		localStore.customPackage.ticket = ticket;
		app.setLocalStore(localStore);
	},
	clearEndPlace(){
		//清除目的地
		let custom = app.getCloneObject(this.props.data);
		custom.endPlace = [];
		this.props.dispatch(actions.indexAction.updateEndPlace(custom));
		let localStore = app.getLocalStore();
		localStore.customPackage.endPlace = [];
		app.setLocalStore(localStore);
	},
	render(){
		let that = this;
		let data = this.props.data;
		return (
			<div className="container_index">
				<Title titleName="包团定制" hideBack={true}/>
				<img className="banner" src={banner1} alt=""/>
				<div className="main">
					<div className="search_box">
						<div className="search_item">
							<label>出发地</label>
							<Link className="input" ref="start" to={
								{
									pathname:'/startPlace',
									query:{
										data:JSON.stringify(data.startPlace)
									}
								}
							}>{data.startPlace.Name}</Link>
							<i className="icon location_icon" onClick={this.handleLocation}></i>
						</div>
						<div className="search_item">
							<label>目的地</label>
							<Link className="input" ref="end" to={
								{
									pathname:'/location',
									query:{
										data:JSON.stringify(data.endPlace)
									}
								}
							}>{this.getEndPlace(data.endPlace)}</Link>
							<i className={
								data.endPlace.length == 0 ? 'icon arrow' : 'icon del'
							} onClick={this.clearEndPlace}></i>
						</div>
						<div className='position-relative'>
							<div className="search_item search_time" onClick={this.showSelectCalendar}>
								<div className="time_info">
									<p className="time_state">出发</p>
									<p className="time_date">{data.time.startMonth}月{data.time.startDay}日<span>{data.time.startWeek}</span></p>
								</div>
								<div className="days">
									<span>共{data.time.count}天</span>
								</div>
								<div className="time_info">
									<p className="time_state">返回</p>
									<p className="time_date">{data.time.endMonth}月{data.time.endDay}日<span>{data.time.endWeek}</span></p>
								</div>
							</div>
							<div className={data.isChange?"controller at":"controller"} onClick={this.handleControll}>
								<div className="control_banner">可调整</div>
							</div>
						</div>
						<div className="search_item" onClick={this.showSelectPeople}>
							<label>出行人数</label>
							<div className="input travel_input">
								<span className="travel_num">{data.ticket.adultNum}</span>成人,
								<span className="travel_num">{data.ticket.childrenNum}</span>儿童
							</div>
							<i className="icon arrow"></i>
						</div>
						<div className="search_item">
							<Link to={
								this.state.token == '' ? '/login' : '/travelNeedDetail'
							}>
								<div className="blue_btn">下一步</div>
							</Link>
						</div>
					</div>
					<ul className="myself">
						<li>
							<Link to={
								this.state.token == '' ? '/login':'/orderList'
							}>我的订单</Link>
							<p>行程、合同、出游</p>
						</li>
						<li>
							<Link to={
								this.state.token == '' ? '/login':'/personCenter'
							}>个人中心</Link>
							<p>会员、福利</p>
						</li>
					</ul>
					<ul className="certification">
						<li className="cert01"><p className="c1">1分钟</p><p className="c2">提交需求</p></li>
						<li className="cert02"><p className="c1">30分钟</p><p className="c2">地接社定制</p></li>
						<li className="cert03"><p className="c1">1小时</p><p className="c2">获取行程</p></li>
						<li className="cert04"><p className="c1">24小时</p><p className="c2">线上全陪</p></li>
					</ul>
				</div>
				<footer>www.ceekee.com. 思客智旅提供服务</footer>
				<div className="buubbles">
					<div className={this.state.modal} onClick={this.hideModal}></div>
					<div className={this.state.selectPeopleContainer}>
						<div className="tit">出行人数</div>
						<div className="passenger_item clearfix">
							<label>成人</label>
							<span className="change_box">
								<span className="change_btn" onClick={this.reduceAdultNum}>-</span>
								<span className="change_num">{this.state.ticket.adultNum}</span>
								<span className="change_btn" onClick={this.addAdultNum}>+</span>
							</span>
						</div>
						<div className="passenger_item clearfix">
							<label>儿童</label>
							<span className="change_box">
								<span className="change_btn" onClick={this.reduceChildren}>-</span>
								<span className="change_num">{this.state.ticket.childrenNum}</span>
								<span className="change_btn" onClick={this.addChildren}>+</span>
							</span>
						</div>
						<div className="passenger_item">
							<div className="orange_btn" onClick={this.confirmPeople}>确认</div>
						</div>
					</div>
					<div className={this.state.calendar}>
						<div className="calendar_top">
							<div className="time_info">
								<p className="time_state">出发</p>
								<p className="time_date">{data.previewTime.startMonth}月{data.previewTime.startDay}日<span>{data.previewTime.startWeek}</span></p>
							</div>
							<div className="days">
								<span>共<span>{data.previewTime.count}</span>天</span>
							</div>
							<div className="time_info">
								<p className="time_state">返回</p>
								<p className="time_date">{data.previewTime.endMonth}月{data.previewTime.endDay}日<span>{data.previewTime.endWeek}</span></p>
							</div>
						</div>
						<CalendarTable 
							nowDate={ this.state.initTime }
							limitHour='18'
							defaultStartEndSkip='5'
							beforeLimitHourSkip='1'
							afterLimitHourSkip='2'
							totalMonth='3'
							startText='入'
							endText='离'
							startTime={data.customTime[0] ? data.customTime[0] : ''}
							endTime={data.customTime[1] ? data.customTime[1] : ''}
							previewCallback={(start,end) => {
								that.handlePreviewTime(start,end);
							}}
							confirmCallback={(start,end) => {
								that.handleConfirmTime(start,end);
							}}
							ref='callChildren'
						/>
					</div>
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
const mapStateToProps = (state) => {
	return {
		data:state.customPackage
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

IndexPage = connect(mapStateToProps)(IndexPage)

export default IndexPage;