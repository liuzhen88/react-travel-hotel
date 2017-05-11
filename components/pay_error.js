import React from 'react';
import Title from './title';

import payErrorIcon from '../images/qx.svg';

let PayError = React.createClass({
	getInitialState() {
		return {
			titleName:'支付失败'
		}	
	},
	render(){
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='pay-success-container'>
					<div className='pay-success-icon'>
						<img src={payErrorIcon}/>
					</div>
					<div className='pay-success-detail'>
						<div className='pay-success-text'>很抱歉，支付失败</div>
						<div className='pay-success-explain'>错误原因：xxxxxx</div>
						<div className='pay-success-action'>
							<span className='pay-success-action-list'>重新支付</span>
							<span className='pay-success-action-list ml'>联系客服</span>
						</div>
					</div>
					<div className='clear'></div>
				</div>
			</div>
		)
	}
});

export default PayError;