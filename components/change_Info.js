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

let ChangeInfoPage = React.createClass({
	getInitialState: function() {
		return {
			titleName: "修改姓名",
			name:""
		};
	},
	nameChange:function(event)
	{
		this.setState({name:event.target.value});
	},
	handleClick:function()
	{
		var name = this.state.name;
		if(!name)
		{
			app.showMsg("用户姓名不能为空");		
			return;	
		}
		var data={"Name" : name};
		app.Post(apiconfig.EditName,data,this.nameCallback);
	},
	nameCallback:function(data){
		if(app.GetResultState(data))
		{
			alert("姓名修改成功");
			window.location.hash = '#person';
		}
		else {
			app.showMsg(data.Msg);
		}
	},
	render(){
		return (
			<div>
			<Head titleName={this.state.titleName}/>
			<div className="forget forget02 forgetmargin">
				<div className="group_item">
					<input type="text" className="input" placeholder="请输入姓名" value={this.state.name} onChange={this.nameChange} maxLength="16"/>						
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

ChangeInfoPage = connect(mapStateToProps)(ChangeInfoPage)

export default ChangeInfoPage;