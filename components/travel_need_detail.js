import React from 'react';
import {connect} from 'react-redux';
import {createHashHistory} from 'history';
import Title from './title';
import app from '../config/public';
import config from '../config/apiconfig';

const history = createHashHistory();
let TravelNeedDetail = React.createClass({
	getInitialState() {
		return {
			titleName:'包团定制',
			Products:[],
			services:[],
			hasInput:0,
			totalInput:500,
			textAreaValue:''
		}
	},
	componentDidMount() {
		let that = this;
		app.Post(config.SchemeProductInit,{
			data:{}
		},function(data){
			if(data.Code == '0000'){
				that.setState({
					Products:data.Products
				});
				document.getElementById('username').value = data.Contact;
				document.getElementById('tel').value = data.Phone;
			}
		});
	},
	selectProduct(list){
		let Products = this.state.Products;
		if(list.IsSelect == 0){
			Products.forEach(function(item,index){
				if(item.Id == list.Id){
					Products[index].IsSelect = 1;
				}
			});
			this.setState({
				Products:Products
			})
		}
	},
	handleInput(e){
		let value = e.target.value;
		let len = value.length;
		if(len <= this.state.totalInput){
			this.setState({
				hasInput:len,
				textAreaValue:value
			})
		}else{
			value = value.toString().substr(0,499);
			this.setState({
				hasInput:500,
				textAreaValue:value
			})
		}
	},
	submitNeed(){
		//服务
		let product = [];
		this.state.Products.map(function(item){
			if(item.IsSelect == 1){
				product.push(item.Id);
			}
		});
		//其他需求
		let otherNeed = this.state.textAreaValue;

		//姓名
		let userName = document.getElementById('username').value;

		//联系方式
		let userPhone = document.getElementById('tel').value;

		//人均预算
		let userAmount = document.getElementById('every-people-money').value;

		if(userName == ""){
			app.showMsg('请填写联系人姓名');
			return;
		}
		if(userPhone == ''){
			app.showMsg('请填写联系电话');
			return;
		}
		let customData = this.props.data;
		let endPlace = [];

		customData.endPlace.map(function(item){
			endPlace.push({
				Type:item.Type,
				Id:item.Id
			});
		})

		let sendData = {
			Depart:{
				Type:customData.startPlace.Type,
				Id:customData.startPlace.Id[0]
			},
			Dests:endPlace,
			SchemeDate:{
				Adjust:customData.isChange == true ? 1:0,
				LeaveDate:customData.customTime[0],
				GetBackDate:customData.customTime[1]
			},
			Persons:[
				{
					PersonType:1,
					PersonCount:customData.ticket.adultNum
				},
				{
					PersonType:2,
					PersonCount:customData.ticket.childrenNum
				}
			],
			SchemeServices:product,
			Other:otherNeed,
			Contacts:userName,
			ContactPhone:userPhone,
			Budget:userAmount
		};
		app.Post(config.SchemeOrderSubmitForExternal,sendData,function(data){
			if(data.Code == '0000'){
				let nextUrl = "/orderDetail?did="+data.Did;
				history.replace(nextUrl);
			}else{
				app.showMsg(data.Msg);
			}
		})
	},
	render(){
		let that = this;
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='travel-need-service'>
					<div className='travel-need-header'>您需要哪些服务？<span>（选填，多选）</span></div>
					<div className='travel-need-list-container'>
						{
							this.state.Products.map(function(item){
								if(item.IsSelect == 1){
									return <a className='travel-need-list current-city' key={item.Id} onClick={that.selectProduct.bind(null,item)}>{item.Name}</a>
								}else{
									return <a className='travel-need-list' key={item.Id} onClick={that.selectProduct.bind(null,item)}>{item.Name}</a>
								}
							})
						}
					</div>
				</div>
 
				<div className="other-need">
					<div className="use-car-title">
						<div className="use-car-title-name">
							其他需求 <span className="optional">( 选填 )</span>
						</div>
					</div>
					<div className="other-need-container">
						<textarea className='other-need-textarea' 
								placeholder="可留下您的其他要求,如：一个人一个房间；希望我们什么时候联系您" 
 								id="other-need-textarea"
 								value={this.state.textAreaValue}
 								onInput={this.handleInput}
 							>
 						</textarea>
					</div>
					<div className="word-num-container">
						<span id="has-enter-word-num">{this.state.hasInput}</span>
						<span className='delf'> / </span>
						<span id="total-word-num">{this.state.totalInput}</span>
					</div>
				</div>
 				<div className="concat-people">
					<div className="use-car-title">
						<div className="use-car-title-name">
							联系人
						</div>
					</div>
					<div className="concat-list">
						<label className="concat-name">姓名</label>
						<div className="full-touch">
							<input placeholder="请填写联系人姓名" 
								type="text" 
								className="concat-input" 
								id="username"
							/>
						</div>
					</div>
					<div className="concat-list">
						<label className="concat-name">手机号</label>
						<div className="full-touch">
							<input placeholder="填写11位手机号码" 
								type="tel" 
								className="concat-input" 
								id="tel"
							/>
						</div>
					</div>
					<div className="concat-list border-bottom-none">
						<label className="concat-name">人均预算</label>
						<div className="full-touch">
							<input type="number" 
								className="input" 
								placeholder="请输入人均预算" 
								id="every-people-money" 
								pattern="\d*"
							/>
						</div>
						<span className="float-right-span">元</span>
					</div>
				</div>
				<div className='submit-need' onClick={this.submitNeed}>提交需求</div>
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {
		data:state.customPackage
	}
}

TravelNeedDetail = connect(mapStateToProps)(TravelNeedDetail)

export default TravelNeedDetail;