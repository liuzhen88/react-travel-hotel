import React from 'react';
import Title from './title';
import app from '../config/public';
import config from '../config/apiconfig';
import {createHashHistory} from 'history';

import leftIcon from '../images/left.svg';
import rightIcon from '../images/right.svg';
import travelFlyIcon from '../images/jiejsongji.svg';
import moreIcon from '../images/liebiao.svg';


import huodongIcon from '../images/huodong.svg';
import yongcheIcon from '../images/yongche.svg';
import jingdianIcon from '../images/jingdian.svg';
import cantingIcon from '../images/canting.svg';
import zhusuIcon from '../images/zhusu.svg';
import huiyishiIcon from '../images/huiyishi.svg';
import tishiIcon from '../images/tishi.svg';
import tuijiancantingIcon from '../images/tuijiancanting.svg';
import qitaIcon from '../images/qita.svg';

const history = createHashHistory();
let TravelPlan = React.createClass({
	getInitialState() {
		return {
			titleName:'行程方案',
			modalStyle:{
				'display':'none'
			},
			general:{
				'display':'none'
			},
			planDetail:{
				Depart:{
					CityDes:'',
					DateDes:'',
					WeekDes:''
				},
				Return:{
					CityDes:'',
					DateDes:'',
					WeekDes:''
				},
				Person:'',
				Supplier:{
					DesignGrade:0,
					DesignGradeDesc:'',
					Name:'',
					ServiceGrade:'',
					ServiceGradeDesc:'',
					SupplierName:''
				},
				SchemeCost:{
					Amount:'',
					AmountFloat:'',
					Average:'',
					Currency:'',
					Proportion:''
				},
				Button:'',
				Trips:[],
				Price:{
					PriceDesc:{
						Title:'报价说明',
						Contents:[]
					},
					Prices:[],
					ReserveDesc:{
						Title:"预订说明",
						Contents:[]
					}
				},
				Feature:[],
				Gift:{
					Title:'赠送项目',
					Contents:[]
				},
				TripCountDes:'',
				NeedContract:''
			},
			journeySummary:[],
			index:0
		}
	},
	handleGeneral(){
		let that = this;
		let query = this.props.location.query;
		let PlanId = query.SchemePlanId;
		PlanId = PlanId.replace('@','+');
		if(this.state.modalStyle.display == 'none'){
			if(that.state.journeySummary.length == 0){
				app.Post(config.GetJourneySummary,{
					PlanId:PlanId
				},function(data){
					that.setState({
						modalStyle:{
							'display':'block'
						},
						general:{
							'display':'block'
						},
						journeySummary:data.JourneySummaryList
					})
				});
			}else{
				that.setState({
					modalStyle:{
						'display':'block'
					},
					general:{
						'display':'block'
					}
				});
			}
		}
	},
	handleHide(){
		this.setState({
			modalStyle:{
				'display':'none'
			},
			general:{
				'display':'none'
			}
		});
	},	
	componentWillMount() {
		app.checkLogin();
		let that = this;
		let query = this.props.location.query;
		let SchemePlanId = query.SchemePlanId;
		SchemePlanId = SchemePlanId.replace('@','+');
		let SerialNo = query.SerialNo;
		app.Post(config.GetSchemePlanDetail,{
			SchemePlanId:SchemePlanId,
			SerialNo:SerialNo
		},function(data){
			if(data.Code == '0000'){
				let planDetail = {
					Depart:data.Depart,
					Return:data.Return,
					Person:data.Person,
					Supplier:data.Supplier,
					SchemeCost:data.SchemeCost,
					Button:data.Button,
					Trips:data.Trips,
					Price:data.Price,
					Feature:data.Feature,
					Gift:data.Gift,
					TripCountDes:data.TripCountDes,
					NeedContract:data.NeedContract
				}
				that.setState({
					planDetail:planDetail
				},function(){
					let h1 = $("#every-travel-detail").height();
					let h2 = $("#report-price").height();
					let h3 = $("#special").height();
					let h4 = $("#free-send").height();
					$('.travel-plan-detail-content').scroll(function(){
						let h = $(this).scrollTop();
						if(h>=h1 && h<= (h1+h2) ){
							//显示第二个
							if(that.state.index != 1){
								that.setIndex('report-price',1);
							}
						}
						if(h < h1){
							//显示第一个
							if(that.state.index != 0){
								that.setIndex('every-travel-detail',0);
							}
						}
						if(h> (h1+h2) && h<= (h1+h2+h3) ){
							//显示第三个
							if(that.state.index != 2){
								that.setIndex('special',2);
							}
						}
						if( h > (h1+h2+h3) ){
							//第四个
							if(that.state.index != 3){
								that.setIndex('free-send',3);
							}
						}
					})
				})
			}else{
				app.showMsg(data.Msg);
			}
		});
	},
	componentDidMount() {
	},
	getTravelIcon(list){
		let type = list.Type;
		let icon = '';
		switch(type){
			case 0:
				icon = huodongIcon;
				break;
			case 1:
				icon = travelFlyIcon;
				break;
			case 2:
				icon = yongcheIcon;
				break;
			case 3:
				icon = jingdianIcon;
				break;
			case 4:
				icon = cantingIcon;
				break;
			case 5:
				icon = zhusuIcon;
				break;
			case 6:
				icon = travelFlyIcon;
				break;
			case 7:
				icon = huiyishiIcon;
				break;
			case 8:
				icon = tishiIcon;
				break;
			case 9:
				icon = tuijiancantingIcon;
				break;
			case 10:
				icon = qitaIcon;
				break;
			default:
				break;
		}
		return icon;
	},
	setIndex(idName,index){
		let anchorElement = document.getElementById(idName);
		$('.travel-plan-detail-bar-list').removeClass('active-bar');
		$('.travel-plan-detail-bar-list').eq(index).addClass('active-bar');
		this.setState({
			index:index
		});
	},
	handleHash(idName, index){
		let anchorElement = document.getElementById(idName);
		anchorElement.scrollIntoView();
		$('.travel-plan-detail-bar-list').removeClass('active-bar');
		$('.travel-plan-detail-bar-list').eq(index).addClass('active-bar');
		this.setState({
			index:index
		});
	},
	confirmPlan(list){
		let type = list.Type;
		let link = list.link;

		if(type == 101){
			let query = this.props.location.query;
			let SerialNo = query.SerialNo;

			let SchemePlanId = query.SchemePlanId;
			SchemePlanId = SchemePlanId.replace('@','+');

			let msg = '';
			let NeedContract = this.state.planDetail.NeedContract;
			if(NeedContract == 0){
				msg = '确认该地接社的行程报价内容后，请支付该报价，以便地接社为您预订报价资源';
			}else{
				msg = '确认该地接社的行程报价内容后，地接社将为您确认报价资源，并且您将不再接收其他定制师的行程和报价';
			}
			let status = confirm(msg);
			if(status == true){
				app.Post(config.SchemePlanConfirm,{
					SerialNo:SerialNo,
					PlanId:SchemePlanId
				},function(data){
					if(data.Code == '0000'){
						history.replace('/orderDetail?did='+SerialNo);
					}else{
						app.showMsg(data.Msg);
					}
				})
			}
		}

		if(type == 200) {
			window.location.href='tel:'+link;
		}

	},
	render(){
		let index = 0;
		let that = this;
		let j = 1000;
		let fl = 0;
		let keys = 0;
		let spk = 99;
		let DesignGradeDom = '';
		let ServiceGradeDom = '';
		if(this.state.planDetail.Supplier.DesignGrade == 2){
			DesignGradeDom = <div className='design-list'>金牌设计</div>
		}
		if(this.state.planDetail.Supplier.ServiceGrade == 2){
			ServiceGradeDom = <div className='design-list'>金牌服务</div>
		}
		let buttons = this.state.planDetail.Button;
		let confirmMethod = '';
		if(buttons){
			confirmMethod = <div className='submit-need' onClick={this.confirmPlan.bind(null,buttons)}>{this.state.planDetail.Button.Name}</div>
		}
		let pre = '';
		let AmountFloat = this.state.planDetail.SchemeCost.AmountFloat;
		if(AmountFloat == 1){
			pre = <div className='travel-plan-header-precent text-right'>
					高预算<span className='diff-precent high'>{this.state.planDetail.SchemeCost.Proportion}</span>
				</div>;
		}else{
			pre = <div className='travel-plan-header-precent text-right'>
					低预算<span className='diff-precent'>{this.state.planDetail.SchemeCost.Proportion}</span>
				</div>;
		}
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='travel-plan-header'>
					<div className='travel-plan-header-top'></div>
					<div className='travel-plan-header-btm'>
						<div className='travel-plan-icon-left'>
							<img src={leftIcon}/>
						</div>
						<div className='travel-plan-icon-right'>
							<img src={rightIcon}/>
						</div>
					</div>
					<div className='travel-plan-header-content'>
						<div className='travel-plan-header-detail'>
							<span className='travel-plan-header-person'>
								{this.state.planDetail.Person}
							</span>
							<div className='travel-plan-header-start'>
								<div>
									<span className='place-name'>{this.state.planDetail.Depart.CityDes}</span>
									<span className='place-text'>出发</span>
								</div>
								<div className='play-time text-left'>
									{this.state.planDetail.Depart.DateDes}
								</div>
								<div className='time-week text-left'>{this.state.planDetail.Depart.WeekDes}</div>
							</div>
							<div className='travel-plan-header-end'>
								<div>
									<span className='place-name'>{this.state.planDetail.Return.CityDes}</span>
									<span className='place-text'>返回</span>
								</div>
								<div className='play-time text-right'>
									{this.state.planDetail.Return.DateDes}
								</div>
								<div className='time-week text-right'>{this.state.planDetail.Return.WeekDes}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='travel-plan-header-djs'>
							<div className='travel-plan-header-service'>
								<div className='design-name'>{this.state.planDetail.Supplier.Name}</div>
								<div className='design-list-container'>
									{DesignGradeDom}
									{ServiceGradeDom}
								</div>
							</div>
							<div className='travel-plan-header-price'>
								<div className='travel-plan-header-total text-right'>
									合计<span className='total-price'>￥{this.state.planDetail.SchemeCost.Amount}</span>
								</div>
								<div className='travel-plan-header-precent text-right'>
									人均<span className='total-price'>￥{this.state.planDetail.SchemeCost.Average}</span>
								</div>
								{pre}
							</div>
						</div>
					</div>
				</div>
				<div className='travel-plan-detail'>
					<div className='travel-plan-detail-bar'>
						<a className='travel-plan-detail-bar-list active-bar' onClick={this.handleHash.bind(null,'every-travel-detail',0)}>{this.state.planDetail.TripCountDes}</a>
						<a className='travel-plan-detail-bar-list' onClick={this.handleHash.bind(null,'report-price',1)}>报价</a>
						<a className='travel-plan-detail-bar-list' onClick={this.handleHash.bind(null,'special',2)}>特色</a>
						<a className='travel-plan-detail-bar-list' onClick={this.handleHash.bind(null,'free-send',3)}>赠送</a>
					</div>
				</div>
				<div className='travel-plan-detail-content'>
					<div id='every-travel-detail'>
						{
							this.state.planDetail.Trips.map(function(item){
								index++
								return <div className='travel-plan-list' key={item.DayDes}>
											<div className='travel-plan-list-title'>{item.TripName}</div>
											{
												item.Details.map(function(list){
													j++
													return <div className='travel-plan-time-list' key={list.JourneyTime+j}>
																<div className='travel-plan-time-header'>
																	<img src={ that.getTravelIcon(list) }/>
																	<span className='travel-plan-time'>{list.JourneyTime}</span>
																</div>
																<div className='travel-plan-time-detail'>
																	{list.Intro}
																</div>
															</div>
												})
											}
											<div className='ball'>D{index}</div>
										</div>	
							})
						}
					</div>
					<div id='report-price'>
						<div className='report-price'>
							{
								this.state.planDetail.Price.Prices.map(function(item){
									fl++
									return <div className='report-price-list' key={fl}>
												<div className='report-price-list-left'>
													{item.TypeDesc}
												</div>
												<div className='report-price-list-right'>
													<div className='pl'>
														<div className='bt'>
															<div className='count-num'>{item.PriceDetail[0]}</div>
															<div className='count-result'>{item.PriceDetail[1]} <span className='res'>{item.PriceDetail[2]}</span></div>
														</div>
														
														<div className='count-explain'>{item.Des}</div>					
													</div>
												</div>
												<div className='clear'></div>
											</div>
								})
							}
						</div>
						<div className='explain-container'>
							<div className='explain-title'>{this.state.planDetail.Price.PriceDesc.Title}</div>
							{
								this.state.planDetail.Price.PriceDesc.Contents.map(function(item){
									return <div className='explain-content' key={item.Index}>{item.Index + item.Content}</div>
								})
							}
						</div>
					</div>
					<div id='special'>
						<div className='special-container'>
							<div className='explain-container'>
								{
									this.state.planDetail.Feature.map(function(item){
										spk++
										return 	<div key={spk}>
													<div className='explain-title'>{item.Title}</div>
													{
														item.Contents.map(function(list){
															return <div className='explain-content' key={'sp'+spk}>{list.Index + list.Content}</div>
														})
													}
												</div>
									})
								}
							</div>
						</div>
					</div>
					<div id='free-send'>
						<div className='free-send'>
							<div className='explain-container'>
								<div>
									<div className='explain-title'>{this.state.planDetail.Gift.Title}</div>
									{
										this.state.planDetail.Gift.Contents.map(function(list){
											keys++
											return <div className='explain-content' key={'uqu'+keys}>
														{list.Index + list.Content}
													</div>
										})
									}
									<div className='btm-null'></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={
					this.state.index == 0 ? 'more-detail':'more-detail none'
				} onClick={this.handleGeneral}>
					<img src={moreIcon}/>
				</div>
				<div className='modal' style={this.state.modalStyle} onClick={this.handleHide}></div>
				<div className='travel-general' style={this.state.general} onClick={this.handleHide}>
					<div className='travel-general-container'>
						<div className='travel-general-title'>行程概要</div>
						<div className='travel-general-list-container'>
							{
								this.state.journeySummary.map(function(item){
									return 	<div className='travel-general-list' key={item.JournetDate}>
												<div className='travel-general-list-time'>{item.Date}</div>
												<div className='travel-general-list-detail'>{item.Intro}</div>
												<div className='general-ball'></div>
											</div>
								})
							}
						</div>
					</div>
				</div>

				{confirmMethod}
			</div>
		)
	}
});

export default TravelPlan;