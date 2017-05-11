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
let ForgetPage = React.createClass({
	getInitialState: function() {
		return {
			titleName: "重置密码1/2",
			mobileNumber: "",
			step:1,
			codeCss:"sendcode",
			codeIntro:"获取验证码",
			codeCount:60,
			code:"",
			password:"",
			apassword:""
		};
	},
	handleClick01: function(event) {
		var mobile=this.state.mobileNumber;
		if(!validate.checkMobile(mobile))
		{
 			app.showMsg("请输入正确的手机号");
			this.setState({moblieFocus:true});
 			return;
		}

		var data={"phone":mobile};
		app.Post(apiconfig.CheckPhoneIsRegister,data,this.checkPasswordCallback);
		
	},
	checkPasswordCallback:function(data)
	{
		if(app.GetResultState(data))
		{
			this.setState({titleName: "重置密码2/2",mobileNumber:this.refs.mobile.value,step:2});
			app.SendNoLoginSMSCode(this.state.mobileNumber,3,this.sendCodeCallback);
		}
		else if(data.Code=="0001"){
			//this.setState({titleName: "注册 2/2",mobileNumber:this.refs.mobile.value,step:2});
			app.showMsg("该手机号不是思客的用户，请先注册");
		}
		else
		{
			app.showMsg(data.Msg);
		}
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
		app.SendNoLoginSMSCode(this.state.mobileNumber,2,this.sendCodeCallback);
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
	handleClick02: function(event) {
		this.setState({titleName: "重置密码3/3",step:3});
	},
	handleClick03: function(event) {
		var code=this.state.code;
			if(code.length!=4 || !validate.checkNum(code))
			{
				app.showMsg("请输入正确的验证码");
 				return;
			}
			var password=this.state.password;
			var apassword =this.state.apassword;
			if((password.length<6 || password.length>16))
			{
				app.showMsg("请输入正确的密码，密码长度为6-16");
 				return;
			}
			if((apassword.length<6 || apassword.length>16))
			{
				app.showMsg("再次输入密码错误，密码长度为6-16");
 				return;
			}
			if(password != apassword)
			{
				app.showMsg("两次输入的密码不同，请重新输入");
 				return;
			}
		var data={"phone" : this.state.mobileNumber,"code" : code, "password" : password,"passwordA" : apassword};	
		app.Post(apiconfig.ForgetPasswordSetPassword,data,this.setPasswordCallback);
	},
	setPasswordCallback:function(data){
		if(app.GetResultState(data))
		{
			if(!!this.timer)
				clearInterval(this.timer);
			alert("密码重置成功，请继续登录");
			window.location.hash = '#login';
		}else{
			app.showMsg(data.Msg);
		}
	},
	mobileChange:function(event)
	{
		this.setState({mobileNumber:event.target.value});
	},
	codeChange:function(event)
	{
		this.setState({code:event.target.value});
	},
	passwordChange:function(event){
		this.setState({password:event.target.value});
	},
	apasswordChange:function(event){
		this.setState({apassword:event.target.value});
	},
	render(){
		var forget;
		if(this.state.step==1){
			forget =
				<div className="forget forget01">
					<div className="info">
						请先输入注册手机号码<br/>
						以验证账户
					</div>
					<div className="group_item">
						<input type="text" placeholder="请输入11位手机号码" onChange={this.mobileChange} className="input" ref="mobile" maxLength="11"/>
					</div>
					<div className="group_item">
						<a className="orange_btn" onClick={this.handleClick01}>下一步，验证手机号</a>
					</div>
				</div>;
		}else if(this.state.step==2){
			forget =
				<div className="forget forget02">
					<div className="info">
						请验证您的注册手机号码<br/>
						{this.state.mobileNumber}
					</div>
					<div className="group_item">
						<input type="text" className="input" placeholder="请输入手机号码" value={this.state.code} onChange={this.codeChange}maxLength="11"/>
						<a className={this.state.codeCss} onClick={this.sendCode}>{this.state.codeIntro}</a>
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入新登录密码" value={this.state.password} onChange={this.passwordChange} maxLength="16"/>
						
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入新登录密码" value={this.state.apassword} onChange={this.apasswordChange} maxLength="16"/>
						<p className="password_tip">密码需为6-16位数字或字母的组合，不含空格。</p>
					</div>
					<div className="group_item">
						<a className="orange_btn" onClick={this.handleClick03} >重置</a>
					</div>
				</div>;
		}else{
			forget =
				<div className="forget forget03">
					<div className="info">
						设置新登录密码
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入新登录密码" onChange={this.passwordChange} maxLength="16"/>
						
					</div>
					<div className="group_item">
						<input type="password" className="input" placeholder="请输入新登录密码"  onChange={this.apasswordChange} maxLength="16"/>
						<p className="password_tip">密码需为4-16位数字或字母的组合，不含空格。</p>
					</div>
					<div className="group_item">
						<a className="orange_btn" onClick={this.handleClick03} >重置</a>
					</div>
				</div>
		}
		return (
			<div>
				<Head titleName={this.state.titleName}/>
				{forget}
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

ForgetPage = connect(mapStateToProps)(ForgetPage)

export default ForgetPage;