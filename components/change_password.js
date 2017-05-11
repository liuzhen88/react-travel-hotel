import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import styles from '../style/forget.css';
import banner from '../images/banner.png';
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
				<div onClick={this.handleBack} className="back"></div>
				<h3 className="header_title">{ this.props.titleName ? this.props.titleName : '' }</h3>
			</div>
		)
	}
});

let ChangePasswordPage = React.createClass({
	getInitialState: function() {
		return {
			titleName: "修改密码",
			oldpassword:"",
			password:"",
			apassword:""
		};
	},
	oldpasswordChange:function(event)
	{
		this.setState({oldpassword:event.target.value});
	},
	passwordChange:function(event)
	{
		this.setState({password:event.target.value});
	},
	apasswordChange:function(event)
	{
		this.setState({apassword:event.target.value});
	},
	handleClick:function()
	{
		var opassword=this.state.oldpassword;
		var password=this.state.password;
		var apassword=this.state.apassword;

		if((opassword.length<6 || opassword.length>16))
			{
				app.showMsg("请输入正确原的密码，密码长度为6-16");
 				return;
			}
		if((password.length<6 || password.length>16))
			{
				app.showMsg("请输入正确的新密码，密码长度为6-16");
 				return;
			}
			if((apassword.length<6 || apassword.length>16))
			{
				app.showMsg("再次输入密码错误，密码长度为6-16");
 				return;
			}
			if(password != apassword)
			{
				app.showMsg("两次输入的新密码不同，请重新输入");
 				return;
			}
		var data={"passwordo": opassword,"password": password};
		app.Post(apiconfig.EditPassword,data,this.changePasswordCallback);
	},
	changePasswordCallback:function(data)
	{
		if(app.GetResultState(data))
		{
			alert("修改密码成功");
			window.location.hash = '#person';
        }
        else
        {
        	app.showMsg(data.Msg);
        }
	},
	render(){
		return (
			<div>
			<Head titleName="修改密码"/>
			<div className="forget forget02 forgetmargin">
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入原登录密码" value={this.state.oldpassword} onChange={this.oldpasswordChange} maxLength="16"/>						
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入新登录密码" value={this.state.password} onChange={this.passwordChange} maxLength="16"/>						
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请再次输入新登录密码" value={this.state.apassword} onChange={this.apasswordChange} maxLength="16"/>
						<p className="password_tip">密码需为6-16位数字或字母的组合，不含空格。</p>
					</div>
					<div className="group_item">
						<a className="orange_btn" onClick={this.handleClick} >确认</a>
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

ChangePasswordPage = connect(mapStateToProps)(ChangePasswordPage)

export default ChangePasswordPage;