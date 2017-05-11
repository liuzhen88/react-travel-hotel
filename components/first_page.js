import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Title from './title';
import AreaIcon from '../images/area-ico.svg';
// import iScroll from '../config/iscroll/iscroll-probe';
// import ReactIScroll from '../config/iscroll/src/scripts/index';

let FirstPage = React.createClass({
	getInitialState() {
		return {
			pullUp: true,
      		pullDown: true
		}
	},
	render(){
		return (
			<div>
				<Title/>
				<div>我是第一个页面</div>
				<Link to='/second'>点击跳转到第二个页面</Link>
				<img src={AreaIcon}/>
				<div>
					{
						this.props.list.map(function(item){
							return <div key={item.Id}>
										<span>{item.Amount}</span>
										<span>{item.Desc}</span>
									</div>
						})
					}
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

FirstPage = connect(mapStateToProps)(FirstPage)

export default FirstPage;