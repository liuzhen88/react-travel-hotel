import React from 'react';
import Title from './title';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import actions from '../actions/action';
import TravelIcon from '../images/lvxing.svg';
import HotelIcon from '../images/jiudian.svg';
import app  from '../config/public';
import apiconfig from '../config/apiconfig';
import { Link } from 'react-router';
import  PullRefresh from 'reactjs-pull-refresh'

let OrderListButton=React.createClass({
	toPay:function()
	{
		window.location.hash = '#cashier?did=' +this.props.orderNum;
	},
	render(){
		var buttonCssName="",buttonName="";
		if(this.props.buttonList==null || this.props.buttonList.length<=0){
			buttonCssName="none";
		}
		else{
			console.log(JSON.stringify(this.props.buttonList));
			buttonName=this.props.buttonList[0].Name;
		}
		return(
			<div className={buttonCssName}>
			<div className='order-center-list-pay'>
				<div className='order-center-list-action'>
				<Link className="link" onClick={this.toPay}>{buttonName}</Link></div>
			</div>
			<div className='clear'></div>
			</div>
			)
	}
});

let OrdersList = React.createClass({
	getInitialState() {
		return {
			titleName:'订单列表',
			type:0,
			pageIndex:1,
			pageSize:10,
			dataTitle:[],
			dataOrder:[],
			errorMsg:"",
			errorCss:"box_listerror none",
			pullUp: true,
      		pullDown: true,
      		hasMore:true
		}
	},
	componentWillMount : function(){
		app.checkLogin();
		var type=0;
		if(!!this.props.location.query.type)
			type= this.props.location.query.type;
		this.setState({type:type},this.GetOrderList);
	},
	GetOrderList:function()
	{
		var data={"Type" : this.state.type,page:{"Index" : this.state.pageIndex,"size" : this.state.pageSize}};
		app.Post(apiconfig.GetHotelOrderList,data,this.GetOrderListCallback);
	},
	GetOrderListCallback:function(data)
	{
		//console.log(JSON.stringify(data));
		var moreCount=false;
		if(app.GetResultState(data))
		{
			var orderList1=data.OrderList==null ?[] : data.OrderList;
			var titleList=data.TitleList == null ? [] : data.TitleList;
			var pageInfo=data.PageInfo;
			if(pageInfo==null || pageInfo.Index>=pageInfo.Amount)
			{
				moreCount=false;
			}
			else
			{
				moreCount=true;
			}
			if(orderList1.length<=0)
			{
				this.setState({dataTitle:titleList, dataOrder: orderList1,errorMsg:"暂无订单数据",errorCss:"box_listerror",hasMore:moreCount});
			}else
			 {
			 	var datalist=this.state.dataOrder;
			 	for(var i=0;i<orderList1.length;i++)
			 	{
			 		datalist.push(orderList1[i]);
			 	}
				this.setState({dataTitle:titleList, dataOrder: datalist,errorMsg:"",errorCss:"box_listerror none",hasMore:moreCount});
			}
		}
		else{
			if(data.Code=="0001")
			{
				var orderList1=data.OrderList==null ?[] : data.OrderList;
				var titleList=data.TitleList == null ? [] : data.TitleList;
				this.setState({dataTitle:titleList, dataOrder: orderList1,errorMsg:data.Msg,errorCss:"box_listerror",hasMore:moreCount});
			}else {
				this.setState({dataTitle:[], dataOrder: [],errorMsg:data.Msg,errorCss:"box_listerror",hasMore:moreCount});
			}
		}
	},
	CheckOrderType:function(item)
	{
		this.setState({type:item.Id,pageIndex:1,dataTitle:[],dataOrder:[]},this.GetOrderList);
	},
	refreshCallback:function(){
		return new Promise((resolve, reject) => {
      setTimeout(() => {
      	try{
      		this.setState({pageIndex:1,dataTitle:[],dataOrder:[]},this.GetOrderList);
 			resolve();
      	}catch(e){
			reject(new Error('错误'));
      	}
      }, 300);
    });
	},
	loadMoreCallback:function(){
	return new Promise((resolve, reject) => {
      setTimeout(() => {
        try
        {
        	var pageindex=this.state.pageIndex +1;
        	this.setState({pageIndex:pageindex,dataTitle:[]},this.GetOrderList);
			resolve();
        }
        catch(e)
        {
        	reject(new Error('错误'));
        }
      }, 300);
    }).then(() => {
      console.info('加载更多成功！');
    }, () => {
      console.info('加载更多失败！');
    });
	},
	toOrderDetail:function(data)
	{
		window.location.hash = '#orderDetail?did=' + data.SerialNo;
	},
	render(){
		var thisdom=this;
		const {hasMore} = this.state;
		const props = {
      maxAmplitude: 40,
      debounceTime: 30,
      throttleTime: 100,
      deceleration: 0.001,
      refreshCallback: this.refreshCallback,
      loadMoreCallback: this.loadMoreCallback,
      hasMore
    };
		return (
			<div>
      
			<div className="order-center-top">
				<Title titleName={this.state.titleName}/>
				<div className='order-navigator'>
				{
					this.state.dataTitle.map(function(item){
						if(thisdom.state.type == item.Id){
							return <div className='order-navigator-list active-navigator' key={item.Id}>{item.Name}</div>
						}else
						{
							return <div className='order-navigator-list' key={item.Id} onClick={thisdom.CheckOrderType.bind(null,item)}>{item.Name}</div>
						}
					})
				}
					<div className='clear'></div>
				</div>
			</div>
			<div className={this.state.errorCss}>
					<div className="box">
						<div className="noresult">{this.state.errorMsg}</div>
					</div>
				</div>
				<div>
				<PullRefresh {...props}>
				<div className='order-center-content'>
				{
					this.state.dataOrder.map(function(item){
						var statusCss="",price="",buttonCss="";
						if(item.Status=="已取消")
						{
							statusCss="order-center-list-status order_status_color";
						}
						else {
							statusCss="order-center-list-status";
							if(item.Price !=null && item.Price[1]!=0){
								var fuhao=app.getMoneyCode(item.Price[0]);
								price=fuhao + item.Price[1];
							}
						}

						return <div className='order-center-list' key={item.SerialNo}>
						<div  onClick={thisdom.toOrderDetail.bind(null,item)}>
						<div className='order-center-list-left'>
							<div className='order-center-list-left-container'>
								<div className='order-center-list-title'>{item.Title}</div>
								<div className='order-center-list-detail'>{item.Date}</div>
								<div className='order-center-list-detail'>{item.Person}</div>
							</div>
						</div>
						<div className='order-center-list-right'>
						<div className='order-center-list-price'>{price}</div>
						<div className={statusCss}>{item.Status}</div>
						</div>
						</div>
						<div className='order-center-list-icon'>
							<img src={TravelIcon}/>
						</div>
						<div className='clear'></div>
						<OrderListButton orderNum={item.SerialNo} buttonList={item.ButtonList}/>
					</div>
					})
				}
				</div>
				</PullRefresh>
				</div>
				
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {
		SchemeorderList:state.orderListResult
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

export default OrdersList;