import React from 'react';
import Title from './title';
import promptIcon from '../images/qx.svg';
import weixinIcon from '../images/weixing.svg';
import notSelectIcon from '../images/no-select.svg';
import SelectIcon from '../images/yixuan.svg';
import zfbIcon from '../images/zfb.svg';
import app  from '../config/public';
import apiconfig from '../config/apiconfig';

let Cashier = React.createClass({
	getInitialState() {
		return {
			titleName:'收银台',
			productType:2,
			serialNo:"",
			hit:"",
			title:"",
			date:"",
			person:"",
			payList:[],
			money:[],
			time1:0,
			intervalId:"",
			paytype:0,
			timeBasics:"",
			timeShow:"",
			payForm:"",
			payType:0,
			orderStatus:0
		}	
	},
	componentWillMount : function(){
		var serialNo =this.props.location.query.did;
		if(!!serialNo)
		{
			this.setState({serialNo: serialNo});
		}
		else {
			alert("订单号不能为空!");
			window.location.hash ="#orderlist";
		}
		var data={"SerialNo": serialNo,"ProductType": this.state.productType};
		app.Post(apiconfig.GetOrderPayInfo,data,this.payInfoCallback);
	},
	componentWillUnmount:function(){
		clearInterval(this.state.intervalId);
	},
	payInfoCallback:function(data){
		if(app.GetResultState(data))
		{
			console.log(JSON.stringify(data));
			var leftTime=0,paytype=0;
			var hitStr="",titleStr="",dateStr="",personStr="",moneyStr="";
			try {
				var strTime = data.PayInfo.Time.replace(/-/g, "/");
				var sysTime = data.PayInfo.SystemTime.replace(/-/g, "/");
				leftTime = new Date(strTime).getTime() - new Date(sysTime).getTime();
			} catch(e) {}
			hitStr=data.PayInfo.Hits.replace("Time",this.getCountdown(leftTime));
			titleStr=data.PayInfo.Title;
			dateStr=data.PayInfo.Date;
			personStr=data.PayInfo.Person;
			var moneys=[];
			moneys.push(app.getMoneyCode(data.PayInfo.Price[0]));
			moneys.push(data.PayInfo.Price[1]);
			for(var i=0;i< data.PayTypeList.length;i++)
			{
				if(data.PayTypeList[i].IsSelect==1)
				{
					paytype=data.PayTypeList[i].Type;
					break;
				}
			}
			this.setState({hit:hitStr,title:titleStr,date:dateStr,payList:data.PayTypeList,money:moneys,
				time1:leftTime,timeBasics: data.PayInfo.Hits,payType:paytype,person:personStr,orderStatus:data.PayInfo.OrderStatus},this.runCountdown);
		}else{
			app.showMsg(data.Msg);
		}
	},
	getCountdown: function(leftTime) {
		var leftsecond = parseInt(leftTime / 1000);
		var day1 = Math.floor(leftsecond / (60 * 60 * 24));
		var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
		var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
		var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);

		if(hour > 0) {
			return hour + '小时' + minute + '分' + second + '秒';
		} else if(minute > 0) {
			return minute + '分' + second + '秒';
		} else if(second > 0) {
			return second + '秒';
		} else {
			return false;
		}
	},
	    runCountdown:function() {
        var countdown = 0;
        var that=this;
        var _runPayOrderCountDown = window.setInterval(function () {
            countdown = that.state.time1 - 1000;
            if (!!that.getCountdown(countdown)) {
                that.setState({hit: that.state.timeBasics.replace("Time",that.getCountdown(countdown)),time1 : countdown,intervalId :_runPayOrderCountDown });
            } else {
                clearInterval(_runPayOrderCountDown);
                return false;
            }
        }, 1000);
    },
    toPay:function(){
    	var data={"ProductType" : this.state.productType,"SerialNo": this.state.serialNo,
    	"Type" : this.state.payType,"ReturnUrl" : "https://cgfyg.ceekee.com/#/paySuccess","OrderStatus":this.state.orderStatus};
    	app.Post(apiconfig.GetOrderPayForm,data,this.toPayCallback);
    },
    toPayCallback:function(data)
    {
    	if(app.GetResultState(data))
		{
    		this.setState({payForm:data.PayPram});
    	}
    	else
    	{
    		app.showMsg(data.Msg);
    	}
    },
    checkPayType:function(item){
    	var paytypeList=this.state.payList;
    	var paytype=0;
    	if(paytypeList!=null && paytypeList.length>0)
    	{
    		if(paytypeList.length==1)
    			return;
    		for(var i=0;i< paytypeList.length;i++)
			{
				if(paytypeList[i].Type==item.Type)
				{
					paytypeList[i].IsSelect=1;
					paytype=paytypeList[i].Type;
				}else {
					paytypeList[i].IsSelect=0;
				}
			}
			this.setState({payType:paytype,payList:paytypeList});
    	}
    },
	render() {
		var that=this;
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='cashier-title'>
					<img src={promptIcon}/>
					<span>{this.state.hit}</span>
				</div>
				<div className='cashier-order'>
					<div className='cashier-order-title'>{this.state.title}</div>
					<div className='cashier-order-time'>{this.state.date}</div>
					<div className='cashier-order-bed'>{this.state.person}</div>
				</div>
				<div>
				{
				this.state.payList.map(function(item){
					var icon="";
				if(item.IsSelect==1)
					icon=SelectIcon;
				else
					icon=notSelectIcon;
				return	<div className='cashier-pay-container' key={item.Type}>
					<div className='cashier-pay-left'>
						<div className='cashier-pay-icon'>
							<img src={item.Logo} />
						</div>
						<div className='cashier-pay-explain'>
							<div className='cashier-pay-explain-name'>{item.Title}</div>
							<div className='cashier-pay-explain-text'>{item.Body}</div>
						</div>
					</div>
					<div className='cashier-pay-right' onClick={that.checkPayType.bind(null,item)}>
						<img src={icon}/>
					</div>
					<div className='clear'></div>
				</div>
				})
				}
				</div>
				<div className='cashier-btm'>
					<div className='cashier-btm-price'>
						<span className='cashier-btm-price-name'>支付金额</span>
						<span className='cashier-btm-price-num'>
							<span className='mon'>{this.state.money[0]}</span>{this.state.money[1]}
						</span>
					</div>
					<div className='cashier-go-pay' onClick={this.toPay}>
						<a>确认支付</a>
					</div>
				</div>
				<form className="none;">{this.state.payForm}</form>
			</div>
		)
	}
});

export default Cashier;