import React from 'react';
import app from '../config/public';
import Title from './title';
import config from '../config/apiconfig';
import '../style/order_detail.css';
import phone from '../images/dianhua.svg';
import {createHashHistory} from 'history';

import inDesign from '../images/sjz.svg';
import dqrIcon from '../images/dqr.svg';
import schtIcon from '../images/scht.svg';
import dfkIcon from '../images/dfk.svg';
import dcxIcon from '../images/dcx.svg';
import ycxIcon from '../images/ycx.svg';
import qxIcon from '../images/cancle.svg';

const history = createHashHistory();

let OrderDetail = React.createClass({
	getInitialState() {
		return {
			titleName:'订单详情',
			isModalShow:{
				'display':'none'
			},
			isCancleReasonShow:{
				'display':'none'
			},
			needDetail:{
				DepartName:'',
				DestName:'',
				DepartDate:'',
				GetBackDate:'',
				IsCanAdjust:'',
				Persons:'',
				SchemeProduct:'',
				Others:''
			},
			orderDetail:{
				Status:{
					StatusDes:'',
					StatusStr:'',
					StatusVal:''
				},
				Cost:{
					Amount:'',
					Currency:'',
					Des:''
				},
				ButtonList:[],
				Contacts:'',
				ContactPhone:'',
				OrderSerialNo:'',
				SubmitTime:''
			},
			Schemes:[],
			CancelResons:[],
			isCanSubmit:false,
			orderStatusIcon:'',
			SupplierCount:''
		}	
	},
	componentDidMount() {
		let that = this;
		let query = this.props.location.query;
		let did = query.did;
		//需求详情
		app.Post(config.SchemeDemandDetailForExternal,{
			SerialNo:did
		},function(data){
			if(data.Code == '0000'){
				let needDetail = {
					DepartName:data.DepartName,
					DestName:data.DestName,
					DepartDate:data.DepartDate,
					GetBackDate:data.GetBackDate,
					IsCanAdjust:data.IsCanAdjust,
					Persons:data.Persons,
					SchemeProduct:data.SchemeProduct,
					Others:data.Others
				};
				that.setState({
					needDetail:needDetail
				});
			}else{
				app.showMsg(data.Msg);
			}
		});

		//顶部设计中？数据
		app.Post(config.GetSchemeOrderDetail,{
			SerialNo:did
		},function(data){
			if(data.Code == '0000'){
				let orderDetail = {
					Status:data.Status,
					Cost:data.Cost,
					ButtonList:data.ButtonList ? data.ButtonList : [],
					Contacts:data.Contacts,
					ContactPhone:data.ContactPhone,
					OrderSerialNo:data.OrderSerialNo,
					SubmitTime:data.SubmitTime
				};
				let iconValue = that.getIcon(data.Status.StatusVal);
				that.setState({
					orderDetail:orderDetail,
					orderStatusIcon:iconValue,
					SupplierCount:data.SupplierCount,
					titleName:data.Name
				})
			}else{
				app.showMsg(data.Msg);
			}
		});

		//具体行程
		app.Post(config.GetSchemePlanList,{
			SerialNo:did
		},function(data){
			if(data.Code == '0000'){
				that.setState({
					Schemes:data.Schemes
				})
			}
		});
	},
	getIcon(value){
		let iconValue = '';
		switch(value){
			case 1:
				//设计中
				iconValue = inDesign;
				break;
			case 11:
				//待确认方案
				iconValue = dqrIcon;
				break;
			case 2:
				//待上传合同
				iconValue = schtIcon;
				break;
			case 21:
				//待确认合同
				iconValue = dqrIcon;
				break;
			case 31:
				//待付定金
				iconValue = dfkIcon;
				break;
			case 32:
				//待付全款
				iconValue = dfkIcon;
				break;
			case 33:
				//待付尾款
				iconValue = dfkIcon;
				break;
			case 34:
				//待付差价
				iconValue = dfkIcon;
				break;
			case 41:
				//待出游
				iconValue = dcxIcon;
				break;
			case 42:
				//待出游
				iconValue = dcxIcon;
				break;
			case 43:
				//待出游
				iconValue = dcxIcon;
				break;
			case 44:
				//待出游
				iconValue = dcxIcon;
				break;
			case 45:
				//出游中
				iconValue = ycxIcon;
				break;
			case 5:
				//已出游
				iconValue = ycxIcon;
				break;
			case 61:
				//已取消
				iconValue = qxIcon;
				break;
			case 62:
				//已取消
				iconValue = qxIcon;
				break;
			case 63:
				//已取消
				iconValue = qxIcon;
				break;
			case 64:
				//已取消
				iconValue = qxIcon;
				break;
			case 71:
				//退款中
				iconValue = schtIcon;
				break;
			case 72:
				//已退款
				iconValue = schtIcon;
				break;
			case 51:
				//已出游
				iconValue = ycxIcon;
				break;
			default:
				break; 
		}
		return iconValue;
	},
	handleCancleOrder(){
		let that = this;
		let query = this.props.location.query;
		let did = query.did;
		if(this.state.CancelResons.length == 0){

			//请求取消订单数据
			app.Post(config.GetCancelReson,{
				SerialNo:did
			},function(data){
				if(data.Code == '0000'){
					that.setState({
						isModalShow:{
							'display':'block',
						},
						isCancleReasonShow:{
							'display':'block'
						},
						CancelResons:data.CancelResons
					});
				}else{
					app.showMsg(data.Msg);
				}
			})
		}else{
			that.setState({
				isModalShow:{
					'display':'block',
				},
				isCancleReasonShow:{
					'display':'block'
				}
			});
		}
	},
	handleModal(){
		this.setState({
			isModalShow:{
				'display':'none',
			},
			isCancleReasonShow:{
				'display':'none'
			}
		});
	},
	handleButtonClick(list){
		let that = this;
		let type = list.Type;
		console.log(list);
		switch(type){
			case 5:
				//查看合同
				history.push('/orderDetail');
				history.replace('/confirmContract?SerialNo='+list.Link);
				break;
			case 0:
				// history.push('/orderDetail');
				// history.replace('/confirmContract?SerialNo='+list.Link);
				break;
			case 100:
				//支付
				history.push('/orderDetail');
				history.replace('/cashier?did='+list.Link);
				break;
			case 6:
				//取消定单
				that.handleCancleOrder();
				break;
			case 303:
				//联系客服
				window.location.href='tel:'+list.Link;
				break;
			case 304:
				//重新预订
				history.push('/orderDetail');
				history.replace('/');
				break;
			default:

				break;
		}
	},
	cancleResonSelect(list){
		let CancelResons = this.state.CancelResons;
		CancelResons.forEach(function(value,index){
			CancelResons[index].isSelect = false;
			if(value.Id == list.Id){
				CancelResons[index].isSelect = true;
			}
		});
		this.setState({
			CancelResons:CancelResons,
			isCanSubmit:true
		});
	},
	submitCancleOrder(){
		//取消订单
		let CancelResons = this.state.CancelResons;

		let CancelResonId = '';
		let CancelReson = '';
		CancelResons.map(function(item){
			if(item.isSelect == true){
				CancelResonId = item.Id;
				CancelReson = item.Reson;
			}
		});
		if(CancelResonId == ''){
			app.showMsg('请选择取消订单的原因');
			return;
		}

		let query = this.props.location.query;
		let SerialNo = query.did;
		app.Post(config.SchemeOrderCancel,{
			SerialNo:SerialNo,
			CancelResonId:CancelResonId,
			CancelReson:CancelReson
		},function(data){
			if(data.Code == '0000'){
				app.showMsg(data.Msg);
				window.location.reload();
			}else{
				app.showMsg(data.Msg);
			}
		});
	},
	handleFun(list){
		console.log(list);
		let type = list.Type;
		let query = this.props.location.query;
		let SerialNo = query.did;
		switch(type){
			case 5:
				//查看方案 
				history.push('/orderDetail');
				let planId = list.Link;
				planId = planId.replace('+','@');
				history.replace('/travelPlan?SchemePlanId='+planId+'&SerialNo='+SerialNo);
				break;
			case 501:
				//查看合同
				history.push('/orderDetail');
				history.replace('/confirmContract?SerialNo='+SerialNo);
				break;
			default:
				break;
		}
	},
	getStatusDes(){
		let SupplierCount = this.state.SupplierCount;
		let statusDes = this.state.orderDetail.Status.StatusDes;
		let arr = statusDes.split('SupplierCount');
		let start = '';
		let middle = '';
		let end = '';
		if(arr.length > 1){
			start = arr[0];
			middle = SupplierCount;
			end = arr[1];
		}else{
			start = arr[0];
		}
		return {
			start:start,
			SupplierCount:middle,
			end:end
		}
	},
	render(){
		let that = this;
		let orderPrice = '';
		if(this.state.orderDetail.Cost.Amount){
			orderPrice = <div className='order-total-price'>订单总额 <span className='order-price'>￥{this.state.orderDetail.Cost.Amount} </span></div>
		}else{
			orderPrice = <div className='order-total-price'>{this.state.orderDetail.Cost.Des}</div>
		}
		return (
			<div className='order-container'>
				<Title titleName={this.state.titleName}/>
				<div className='order-content'>
					<div className='order-status-container'>
						<div className='order-status-icon'>
							<img src={this.state.orderStatusIcon}/>
						</div>
						<div className='order-status-content'>
							<div className='order-status-name'>{this.state.orderDetail.Status.StatusStr}</div>
							<div className='order-status-word'>
								{this.getStatusDes().start}
								<span className='recevice-num'> {this.getStatusDes().SupplierCount} </span>
								{this.getStatusDes().end}
							</div>
						</div>
						<div className='clear'></div>
					</div>
					<div className='order-price-container'>
						{orderPrice}
					</div>
					<div className='order-action-container'>
						<div className='order-action'>
							{
								this.state.orderDetail.ButtonList.map(function(item){
									 
									return <div className='order-action-button' key={item.Type} onClick={that.handleButtonClick.bind(null,item)}>{item.Name}</div>
								})
							}
							<div className='clear'></div>
						</div>
					</div>
				</div>
				<div className='order-travel-container'>
					{
						this.state.Schemes.map(function(item){
							let design = '';
							let service = '';
							let AmountFloat = item.SchemeCost.AmountFloat;
							let pre = '';
							if(AmountFloat == 1){
								pre = <span className='order-travel-precent shangshen'>↑ {item.SchemeCost.Proportion}</span>;
							}else{
								pre = <span className='order-travel-precent'>↓ {item.SchemeCost.Proportion}</span>;
							}
							if(item.ServiceGradeDesc != ''){
								service = <div className='order-sign-list'>{item.ServiceGradeDesc}</div>;
							}
							if(item.DesignGradeDesc != ''){
								design = <div className='order-sign-list'>{item.DesignGradeDesc}</div>;
							}
							return <div className='order-travel-content' key={item.Id}>
										<div className='order-travel-top'>
											<div className='order-travel-title'>{item.Name}</div>
											<div className='order-sign-container'>
												{design}
												{service}
												<div className='clear'></div>
											</div>
										</div>
										<div className='order-travel-detail'>
											{
												item.LineDetails.map(function(list){
													return <div className='order-travel-list' key={list.JournetDate}>
																<div className='order-travel-list-time'>{list.Date}</div>
																<div className='order-travel-list-content'>{list.Intro}</div>
																<div className='roll'></div>
															</div>
												})
											}
										</div>
										<div className='order-travel-explain'>
											<div className='order-travel-price'>
												<span className='order-travel-price-person'>
													<span className='order-travel-price-num'>
														￥{ item.SchemeCost.Average}
													</span>/人
												</span>
												{pre}
											</div>
											<div className='order-travel-action'>
												{
													item.ButtonList.map(function(list){
														return <span className='order-travel-action-list' key={list.Type} onClick={that.handleFun.bind(null,list)}>{list.Name}</span>
													})
												}
												<a className='order-travel-tel' href={'tel:'+item.ContactPhone}>
													<img src={phone}/>
												</a>
											</div>
											<div className='clear'></div>
										</div>
									</div>
						})
					}
				</div>
				<div className='contact-container'>
					<div className='contact-content'>
						<div className='order-title-container'>需求详情</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>出行地</div>
								<div className='new-common-flow-content'>{this.state.needDetail.DepartName}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>目的地</div>
								<div className='new-common-flow-content'>{this.state.needDetail.DestName}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>往返日期</div>
								<div className='new-common-flow-content'>
									{this.state.needDetail.DepartDate + this.state.needDetail.GetBackDate + this.state.needDetail.IsCanAdjust}
								</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>出行人数</div>
								<div className='new-common-flow-content'>{this.state.needDetail.Persons}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>所选服务</div>
								<div className='new-common-flow-content'>{this.state.needDetail.SchemeProduct}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list border-bottom-none'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>其他需求</div>
								<div className='new-common-flow-content'>{this.state.needDetail.Others}</div>
							</div>
							<div className='clear'></div>
						</div>
					</div>
				</div>
				<div className='contact-container'>
					<div className='contact-content'>
						<div className='order-title-container'>联系信息</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>联系人</div>
								<div className='new-common-flow-content'>{this.state.orderDetail.Contacts}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list border-bottom-none'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>手机号</div>
								<div className='new-common-flow-content'>{this.state.orderDetail.ContactPhone}</div>
							</div>
							<div className='clear'></div>
						</div>
					</div>
				</div>
				<div className='contact-container margin-btm'>
					<div className='contact-content'>
						<div className='order-title-container'>其他需求</div>
						<div className='order-content-list'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>需求单号</div>
								<div className='new-common-flow-content'>{this.state.orderDetail.OrderSerialNo}</div>
							</div>
							<div className='clear'></div>
						</div>
						<div className='order-content-list border-bottom-none'>
							<div className='new-common-flow-left'>
								<div className='new-common-flow-name'>提交时间</div>
								<div className='new-common-flow-content'>{this.state.orderDetail.SubmitTime}</div>
							</div>
							<div className='clear'></div>
						</div>
					</div>
				</div>
				<div className='modal' style={this.state.isModalShow} onClick={this.handleModal}></div>
				<div className='cancle-container' style={this.state.isCancleReasonShow}>
					<div className='cancle-title'>取消订单</div>
					<div className='cancle-content'>
						<div className='cancle-content-title'>已邀请优质地接社专门设计，取消就没有了哦，是否继续？</div>
						<div className='cancle-content-reason'>请选择取消订单的原因 <span>（必选）</span></div>
						{
							this.state.CancelResons.map(function(item){
								return <div className={
									item.isSelect ? 'cancle-content-reason-list select-cancle':'cancle-content-reason-list'
								} key={item.Id} onClick={that.cancleResonSelect.bind(null,item)}>
											{item.Reson}
										</div>
							})
						}
					</div>
					<div className={
						this.state.isCanSubmit == true ? 'cancle-content-submit can-submit':'cancle-content-submit'
					} onClick={this.submitCancleOrder}>提交</div>
				</div>
			</div>
		)
	}
});

export default OrderDetail;