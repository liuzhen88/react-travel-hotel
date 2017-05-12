import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import styles from '../style/person.css';
import HeadIcon from '../images/picture.png';
import app  from '../config/public';
import validate from '../config/validate';
import apiconfig from '../config/apiconfig';

let Head = React.createClass({
	handleBack(){
		history.back();
	},
	render(){
		return (
			<div className={ this.props.className ? this.props.className : "header"}>
				<h3 className="header_title">{ this.props.titleName ? this.props.titleName : '' }</h3>
			</div>
		)
	}
});
let PersonPage = React.createClass({
	getInitialState: function() {
		return {
			titleName: "修改姓名",
			name:"",
			phone:""
		};
	},
	componentWillMount : function(){
		var memberId=app.getSettings().memberId;
		if(!!memberId && memberId!="")
		{
			window.location.hash = '#login';
		}else {
			app.Post(apiconfig.GetCustomerInfo,{"a":1},this.dataCallback);
		}
	},
	dataCallback:function(data){
		if(app.GetResultState(data))
		{
			this.setState({name:data.Name,phone:data.Phone});
		}
		else {
			alert(data.Msg);
			window.location.hash = '#login';
		}
	},
    changePassword:function(){
    	window.location.hash = '#changepassword';
    },
    changeName:function(){
    	window.location.hash = '#changeinfo';
    },
	render(){
		return (
			<div>
				<Head titleName="个人资料"/>
				<div className="container">
					<div className="item_nobefore clearfix"><label>头像</label><span className="item_r"><img className="headImg" src={HeadIcon} alt=""/></span></div>
					<div className="item_nobefore clearfix"><label>手机</label><span className="item_r">{this.state.phone}</span></div>
					<div className="item clearfix" onClick={this.changeName}><label>姓名</label><span className="item_r">{this.state.name}</span></div>
					<div className="item clearfix" onClick={this.changePassword}><label>修改密码</label><span className="item_r"></span></div>
				</div>
				<div className="fix_bottom">
					<div className="fix_wrapper">
						<div className="exit_btn">退出当前帐户</div>
					</div>
				</div>
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {
		list:state.textName
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

PersonPage = connect(mapStateToProps)(PersonPage)

export default PersonPage;