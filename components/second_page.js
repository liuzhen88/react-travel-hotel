import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';


let SecondPage = React.createClass({
	handleClick(){
		this.props.dispatch(actions.textNameActionAsync());
	},
	render(){
		return (
			<div>
				<div>我是第二个页面</div>
				<Link to='/first'>点击跳转到第一个页面</Link>
				<button onClick={this.handleClick}>点击我修改第一个页面的数据</button>
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

SecondPage = connect(mapStateToProps)(SecondPage);

export default SecondPage;