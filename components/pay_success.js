import React from 'react';
import Title from './title';
import { Link } from 'react-router';
import app  from '../config/public';
import apiconfig from '../config/apiconfig';

import paySuccessIcon from '../images/pay_success.svg';

let PaySuccess = React.createClass({
	getInitialState() {
		return {
			titleName:'支付成功',
			serialNo:"",
			phone:"",
			orderdetail:""
		}	
	},
	componentWillMount : function(){
		var locatinurl=this.getUrlReq();
		//var serialNo =locatinurl.out_trade_no.split('_')[0];
		//this.setState({serialNo: serialNo,orderdetail:"#orderdetail?did=" +serialNo });
		app.Post(app.GetServerPhone,{"a":"a"},);
	},
	serverPhoneCallback:function(data)
	{
		if(app.GetResultState(data))
		{
			this.setState({phone:"tel:" + data.ServerPhone });
		}
		else {
			app.showMsg(data.Msg);
		}
	},
	getUrlReq: function () {
            var url = location.href, i = url.indexOf('?'), req = {};
            if (i > 0) {
                url = url.substring(i + 1, url.length);
            }

            var params = url.split('&');

            for (var i = 0, len = params.length; i < len; i++) {
                var _p = params[i].split('=');
                if (!!_p[1]) {
                    req[_p[0]] = decodeURIComponent(_p[1]);

                    if (_p[0].localeCompare() == 'refid') {
                        ceekeeWap._configs = _p[1];
                    }
                }
            }

            return req;
        },
	render(){
		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='pay-success-container'>
					<div className='pay-success-icon'>
						<img src={paySuccessIcon}/>
					</div>
					<div className='pay-success-detail'>
						<div className='pay-success-text'>恭喜您，支付成功</div>
						<div className='pay-success-explain'>地接社正在帮您预订旅行产品，如有疑问或调整请联系思客，祝您旅程愉快。</div>
						<div className='pay-success-action'>
							<span className='pay-success-action-list'><Link href={this.state.orderdetail}>查看订单</Link></span>
							<span className='pay-success-action-list ml'><Link href={this.state.phone}>联系客服</Link></span>
						</div>
					</div>
					<div className='clear'></div>
				</div>
			</div>
		)
	}
});

export default PaySuccess;