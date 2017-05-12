import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import styles from '../style/register.css';
import banner from '../images/banner.png';
import app  from '../config/public';
import validate from '../config/validate';
import apiconfig from '../config/apiconfig';
import closeIcon from '../images/close.svg';
import Alert from './alert';

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
let AlertConfim = React.createClass({
	handleLogin:function()
	{
		window.location.hash = '#login?mobile=' + this.props.mobileNumber;
	},
	handleChange : function(){
		this.props.showAlert();
	},
	render(){
		return (
			<div className={"bubbles"+ " " + this.props.css}>
				<div className="winMask"></div>
				<div className="winPop">
					<div className="msg">手机号 <span className="mobile">{this.props.mobileNumber}</span> 已注册</div>
					<div className="winbtns">
						<a className="winbtn" onClick={this.handleChange}>修改号码</a><a className="winbtn" onClick={this.handleLogin}>直接登录</a>
					</div>
				</div>
			</div>
		)
	}
});
let RegisterPage = React.createClass({
	getInitialState: function() {
		return {
			titleName: "注册 1/2",
			mobileNumber: "",
			step:1,
			codeCss:"sendcode",
			codeIntro:"获取验证码",
			codeCount:60,
			code:"",
			password:"",
			apassword:"",
			alertCss:"none",
			isAgree:true,
			modal:'modal none',
			TermsContent:'',
			alertoneCss:"none"
		};
	},
	componentWillMount() {
		let that = this;
		app.Post(apiconfig.GetSericeTerms,{data:{}},function(data){
			if(data.Code == '0000'){
				that.setState({
					TermsContent:data.TermsContent
				});
			}
		});
	},
	handleClick01: function(event) {
		if(this.state.isAgree == true){

			var mobile=this.state.mobileNumber;
			if(!validate.checkMobile(mobile))
			{
	 			app.showMsg("请输入正确的手机号");
				this.setState({moblieFocus:true});
	 			return;
			}

			var data={"phone":mobile};
			app.Post(apiconfig.CheckPhoneIsRegister,data,this.checkPhoneCallback);
		}
	},

	checkPhoneCallback:function(data)
	{
		if(app.GetResultState(data))
		{
		    this.setState({alertCss:""});	
		}
		else if(data.Code=="0001"){
			this.setState({titleName: "注册 2/2",mobileNumber:this.refs.mobile.value,step:2});
			app.SendNoLoginSMSCode(this.state.mobileNumber,2,this.sendCodeCallback);
		}else
		{
			app.showMsg(data.Msg);
		}
	},
	handleClick02: function(event) {
		this.setState({titleName: "注册 3/3",step:3});
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
	validateCodeCallback:function(){

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
				app.showMsg("请再次输入密码错误，密码长度为6-16");
 				return;
			}
			if(password != apassword)
			{
				app.showMsg("两次输入的密码不同，请重新输入");
 				return;
			}
		var data={"phone" : this.state.mobileNumber,"code" : code, "password" : password,"passwordA" : apassword};	
		app.Post(apiconfig.Register,data,this.registerCallback);
	},
	registerCallback : function(data){
		if(app.GetResultState(data))
		{
			var settings=app.getSettings();
			settings.Token = data.Token;
			settings.MemberId = data.MemberId;
			settings.LoginType = data.LoginType;
			settings.phone = this.state.mobileNumber;
			app.setSettings(settings);
			if(!!this.timer)
				clearInterval(this.timer);
			this.setState({alertoneCss:""});
		}else
		 {
			app.showMsg(data.Msg);
		}
	},
	handle:function(){
		this.setState({alertoneCss:"none"},function(){app.ToMain();});
		
	},
	mobileChange:function(event)
	{
		this.setState({mobileNumber:event.target.value});
	},
	showAlert:function()
	{
		this.setState({alertCss:"none"});
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
	handleAgree(){
		let isAgree = this.state.isAgree == true ? false:true;
		this.setState({
			isAgree:isAgree
		});
	},
	showContract(){
		this.setState({
			modal:'modal'
		});
	},
	closeModal(){
		this.setState({
			modal:'modal none'
		});
	},
	render(){
		var register;
		if(this.state.step==1){
			register =
			<div className="register register01">
				<div className="info">
					思客智旅欢迎您
				</div>
				<div className="group_item">
					<input type="tel" placeholder="请输入11位手机号码" onChange={this.mobileChange} value={this.state.mobileNumber} className="input" ref="mobile" maxLength="11"/>
					<p className={
						this.state.isAgree == true ? "aggree selected" : "aggree"
					}><i onClick={this.handleAgree}></i>同意<a className="contract" onClick={this.showContract}>《思客智旅服务使用协议》</a></p>
				</div>
				<div className="group_item">
					<a className={
						this.state.isAgree == true ? 'orange_btn':'orange_btn limit-register'
					} onClick={this.handleClick01}>下一步，验证手机号</a>
				</div>
			</div>;
		}else if(this.state.step==2){
			register =
				<div className="register register02">
					<div className="info">
						验证手机  {this.state.mobileNumber}
					</div>
					<div className="group_item">
						<input type="tel" className="input" placeholder="请输入验证码" onChange={this.codeChange} value={this.state.code} ref="mobile" maxLength="4"/>
						<a className={this.state.codeCss} onClick={this.sendCode}>{this.state.codeIntro}</a>
					</div>
					<div className="group_item">
					<input type="password" className="input" placeholder="请设置登录密码" onChange={this.passwordChange}  value={this.state.password} maxLength="16"/>

				</div>
				<div className="group_item">
					<input type="password" className="input" placeholder="请再次输入登录密码" onChange={this.apasswordChange} value={this.state.apassword} maxLength="16"/>
					<p className="password_tip">密码需为6-16位数字或字母的组合，不含空格。</p>
				</div>
				<div className="group_item">
					<a className="orange_btn" onClick={this.handleClick03} >注册</a>
				</div>
				</div>;
		}else{
			register =
			<div className="register register03">
				<div className="info">
					思客智旅欢迎您
				</div>
				<div className="group_item">
					<input type="password" className="input" placeholder="请设置登录密码" onChange={this.passwordChange}  value={this.state.password} maxLength="16"/>

				</div>
				<div className="group_item">
					<input type="password" className="input" placeholder="请再次输入登录密码" onChange={this.apasswordChange}  value={this.state.apassword} maxLength="16"/>
					<p className="password_tip">密码需为6-16位数字或字母的组合，不含空格。</p>
				</div>
				<div className="group_item">
					<a className="orange_btn" onClick={this.handleClick03} >注册</a>
				</div>
			</div>;
		}
		return (
			<div>
				<Head titleName={this.state.titleName}/>
				{register}
				<Alert mobileNumber={this.state.mobileNumber} css={this.state.alertCss}  showAlert={this.showAlert}/>
				<Alert css={this.state.alertoneCss} msg="注册成功" handle={this.handle} />
				<div className={this.state.modal}>
					<div className='cost-box'>
						<h3>服务条款</h3>
						<div className='cost-body' dangerouslySetInnerHTML={{__html: this.state.TermsContent}}>

						</div>
						<div className="cost-footer-btn" onClick={this.closeModal}>
							<img src={closeIcon}/>
						</div>
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
};

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
};

RegisterPage = connect(mapStateToProps)(RegisterPage);

export default RegisterPage;