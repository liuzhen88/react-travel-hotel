import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import styles from '../style/login.css';
import banner from '../images/banner.png';
import app  from '../config/public';
import validate from '../config/validate';
import apiconfig from '../config/apiconfig';

let LoginPage = React.createClass({
	getInitialState: function() {
		return {
			loginType: 1,
			mobileNumber: "",
			codemoblieFocus:false,
			codeFocus:false,
			passwordMoblieFocus:false,
			passwordFocus:false,
			validataCode:"",
			password:"",
			codeCss:"sendcode",
			codeIntro:"获取验证码",
			codeCount:60
		};
	},
	componentWillMount : function(){
		var mobile =this.props.location.query.mobile;
		if(!!mobile)
		{
			this.setState({mobileNumber: mobile});
		}
	},
	loginEntiy : function()
	{
		return {
			phone:"",
			code:"",
			password:"",
			type:0
		}
	},
	handleChange: function(event) {
		this.setState({mobileNumber:event.target.value});
	},
	codeChange: function(event) {
		this.setState({validataCode:event.target.value});
	},
	passwordChange: function(event) {
		this.setState({password:event.target.value});
	},
	handleDelete: function() {
		this.refs.pwd.value = "";
	},
	typeChange1:function(){
		this.setState({loginType:1});
	},
	typeChange2:function(){
		this.setState({loginType:2});
	},
	sendCode:function()
	{
		if(this.state.codeCount==60){
		if(!validate.checkMobile(this.state.mobileNumber))
		{
 			app.showMsg("请输入正确的手机号");
			this.setState({moblieFocus:true});
 			return;
		}
		app.SendNoLoginSMSCode(this.state.mobileNumber,1,this.sendCodeCallback);
		}
	},
	sendCodeCallback:function(data)
	{
		if(app.GetResultState(data))
		{
             
			this.timer = setInterval(function () {
            var count = this.state.codeCount;
            count -= 1;
            if (count < 1) {
              this.setState({codeCss:"sendcode",
			codeIntro:"获取验证码",
			codeCount:60});
            window.clearInterval(this.timer);
            }else
            {
			this.setState({codeCss:"getcode",
			codeIntro:count +"s后再次获取",
			codeCount:count});
		}
          }.bind(this), 1000);
			app.showMsg("验证码发送成功，请注意查收");
		}
		else
		{
			app.showMsg(data.Msg);
		}
	},
	login:function(){
		if(!validate.checkMobile(this.state.mobileNumber))
		{
			app.showMsg("请输入正确的手机号");
			//this.setState({codemoblieFocus:true});
 			return;
		}
		if(this.state.loginType==1)
		{
			var code=this.state.validataCode;
			if(code.length!=4 || !validate.checkNum(code))
			{
				app.showMsg("请输入正确的验证码");
				//this.setState({codeFocus:true});
 				return;
			}
			var loginentity=this.loginEntiy();
			loginentity.phone=this.state.mobileNumber;
			loginentity.type=this.state.loginType;
			loginentity.code=code;

			app.Post(apiconfig.Login,loginentity,this.loginCallback);
		}
		else
		{
			var password=this.state.password;
			if(password.length<6)
			{
				app.showMsg("密码最少为6位");
				//this.setState({codeFocus:true});
 				return;
			}
			var loginentity=this.loginEntiy();
			loginentity.phone=this.state.mobileNumber;
			loginentity.type=this.state.loginType;
			loginentity.password=password;

			app.Post(apiconfig.Login,loginentity,this.loginCallback);
		}
	},
	loginCallback:function(data)
	{
		if(app.GetResultState(data))
		{
			var settings=app.getSettings();
			settings.Token = data.Token;
			settings.MemberId = data.MemberId;
			settings.LoginType = data.LoginType;
			settings.phone = this.state.mobileNumber;
			app.setSettings(settings);
			clearInterval(this.timer);
			app.ToMain();
		}
		else
		{
			app.showMsg(data.Msg);
		}
	},
	toSetPassword:function(){
		if(!!this.timer)
		clearInterval(this.timer);
		window.location.hash = '#forget';
	},
	toRegister:function(){
		if(!!this.timer)
		clearInterval(this.timer);
		window.location.hash = '#register';
	},
	render(){
		//app.checkLogin();
		
		var value = this.state.mobileNumber;
		var code=this.state.validateCode;
		var password=this.state.password;
		var content;
		if(this.state.loginType==1){
			content =
				<div className="tabcont">
					<div className="group_item">
						<input type="text" className="input" placeholder="请输入手机号码" ref="mobile" onChange={this.handleChange} value={value} maxLength="11"/>
						<a className={this.state.codeCss} onClick={this.sendCode}>{this.state.codeIntro}</a>
					</div>
					<div className="group_item">
						<input type="text" className="input" onChange={this.codeChange} placeholder="请输入验证码" ref="msgcode" />
					</div>
					<div className="group_item">
						<a className="orange_btn" onClick={this.login}>登录</a>
					</div>
				</div>;
		}else{
			content =
			<div className="tabcont">
				<div className="group_item">
					<input type="text" className="input" placeholder="请输入手机号码" onChange={this.handleChange} ref="mobile" value={value} maxLength="11"/>
				</div>
				<div className="group_item">
					<input type="password" className="input" placeholder="请输入密码" onChange={this.passwordChange} ref="pwd" maxLength="16"/>
					<div className="del hide" onClick={this.handleDelete}></div>
				</div>
				<div className="group_item">
					<a className="orange_btn" onClick={this.login}>登录</a>
				</div>
				<div className="group_item center">
					<Link className="link" onClick={this.toRegister}>快速注册</Link>|<Link className="link" onClick={this.toSetPassword}>忘记密码</Link>
				</div>
			</div>
		}
		return (
			<div>
				<img className="banner" src={banner} alt=""/>
				<ul className="tabs clearfix">
					<li className={this.state.loginType==1?"at":""} onClick={this.typeChange1}>无密码快捷登录</li>
					<li className={this.state.loginType==2?"at":""} onClick={this.typeChange2}>思客帐号登录</li>
				</ul>
				{content}
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

LoginPage = connect(mapStateToProps)(LoginPage)

export default LoginPage;