import React from 'react';
let Alert = React.createClass({
	handle : function(){
		this.props.handle();
	},
	render(){
		return (
			<div className={"bubbles"+ " " + this.props.css}>
				<div className="winMask"></div>
				<div className="winPop">
					<div className="msg">{this.props.msg}</div>
					<div className="winbtnone">
						<a onClick={this.handle}>确定</a>
					</div>
				</div>
			</div>
		)
	}
});

export default Alert;