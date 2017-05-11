import React from 'react';
import back from '../images/back.png';
import '../style/title.css';

const Title = React.createClass({
	handleBack(){
		history.back();
	},
	getInitialState() {
		return {
			backIcon:'back-title-icon'
		}	
	},
	componentDidMount() {
		let hideBack = this.props.hideBack;
		if(hideBack){
			this.setState({
				backIcon:'none'
			})
		}		
	},
	render(){
		return (
			<div className='common-title-container'>
				{ this.props.titleName ? this.props.titleName : '' }
				<div className={this.state.backIcon} onClick={this.handleBack}>
					<img src={back}/>
				</div>
			</div>
		)
	}
});

export default Title;