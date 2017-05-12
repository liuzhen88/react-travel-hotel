import React from 'react';
import Title from './title';
import { Link } from 'react-router';
import app from '../config/public';
import config from '../config/apiconfig';
import HeadIcon from '../images/head.png';
import BackbgIcon from '../images/wodebj.png';

import dfkIcon from '../images/order-dfk.svg';
import dqrIcon from '../images/order-dqr.svg';
import drzIcon from '../images/order-drz.svg';
import tkIcon from '../images/order-tk.svg';


let PersonCenter = React.createClass({
	getInitialState() {
		return {
			titleName:'个人中心',
			userName:""
		}	
	},
	componentWillMount : function(){
		app.checkLogin();
	},
	componentDidMount() {
		let that = this;
		app.Post(config.GetCustomerIndexInfo,{
			data:{}
		},function(data){
			if(data.Code == '0000'){
				that.setState({
					userName:data.CustomerInfo.NickName
				});
			}else{
				app.showMsg(data.Msg);
			}
		});
	},
	render(){
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<Link to='/person'>
					<div className='person-center-header'>
						<div className='person-center-people'>
							<img src={HeadIcon} className='person-center-icon'/>
						</div>
						<div className='person-center-name'>{this.state.userName}</div>
						<div className='person-center-background'>
							<img src={BackbgIcon}/>
						</div>
					</div>
				</Link>
				<Link to='/orderList?type=0'>
					<div className='person-center-order'>
						<div className='person-center-order-header'>
							<div className='order-title-left'>我的订单</div>
							<div className='to-see-more-order'>查看所有订单</div>
							<div className='clear'></div>
						</div>
					</div>
				</Link>
				<div className='person-center-order-list-container'>
					<Link to='/orderList?type=1'>
						<div className='person-center-order-list'>
							<div className='order-status-icons'>
								<img src={dfkIcon}/>
							</div>
							<div className='order-status-explain'>待付款</div>
						</div>
					</Link>
					<Link to='/orderList?type=3'>
						<div className='person-center-order-list'>
							<div className='order-status-icons'>
								<img src={dqrIcon}/>
							</div>
							<div className='order-status-explain'>待确认</div>
						</div>
					</Link>
					<Link to='/orderList?type=2'>
						<div className='person-center-order-list'>
							<div className='order-status-icons'>
								<img src={drzIcon}/>
							</div>
							<div className='order-status-explain'>待出行</div>
						</div>
					</Link>
					<Link to='/orderList?type=4'>
						<div className='person-center-order-list'>
							<div className='order-status-icons'>
								<img src={tkIcon}/>
							</div>
							<div className='order-status-explain'>退款</div>
						</div>
					</Link>
				</div>
				<Link to='/person'>
					<div className='my-info'>
						<div className='my-info-left'>我的信息</div>
						<div className='to-see-more-order'></div>
						<div className='clear'></div>
					</div>
				</Link>
			</div>
		)
	}
});

export default PersonCenter;