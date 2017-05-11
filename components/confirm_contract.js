import React from 'react';
import Title from './title';
import app from '../config/public';
import config from '../config/apiconfig';
import ImageView from 'react-imageview';
import 'react-imageview/dist/react-imageview.min.css';
import {createHashHistory} from 'history';

import agreeIcon from '../images/agree.svg';
import refuseIcon from '../images/refuse.svg';

let electronExplain = '为支持绿色环保，我同意默认电子合同的有效性，无需再次签署纸质合同';
let paperExplain = '我还是想落地和当地地接社签署纸质合同';

const history = createHashHistory();
let ConfirmContract = React.createClass({
	getInitialState() {
		return {
			titleName:'确认合同',
			isAgree:true,
			imageSrc:agreeIcon,
			imagelist:[],
			preview:{
				'display':'none'
			},
			explain:electronExplain,
			contractStyle:{
				electron:'active-contract',
				paper:''
			},
			ContractType:1,
			IsCompany:1,
			isCompany:1,
			CustomerName:'',
			CustomerPhone:'',
			SupplierName:'',
			SupplierContacter:'',
			ButtonList:[],
			ContractId:'',
			CustomerCertificateNo:'',
			Status:''
		}	
	},
	handleContract(){
		if(this.state.Status != 3){

			if(this.state.isAgree == false){
				this.setState({
					isAgree:true,
					imageSrc:agreeIcon
				});
			}else{
				this.setState({
					isAgree:false,
					imageSrc:refuseIcon
				});
			}
		}
	},
	handleCloseView(){
		this.setState({
			preview:{
				'display':'none'
			}
		})
	},
	showContract(){
		this.setState({
			preview:{
				'display':'block'
			}
		})
	},
	handleElectronContract(){
		//电子合同
		let Status = this.state.Status;
		if(Status != 3){

			this.setState({
				contractStyle:{
					electron:'active-contract',
					paper:''
				},
				explain:electronExplain,
				ContractType:1
			});
		}
	},
	handlePapaerContract(){
		//纸质合同
		let Status = this.state.Status;
		if(Status != 3){

			this.setState({
				contractStyle:{
					electron:'',
					paper:'active-contract'
				},
				explain:paperExplain,
				ContractType:2
			});
		}
	},
	componentDidMount() {
		let that = this;
		let query = this.props.location.query;
		let SerialNo = query.SerialNo;
		app.Post(config.GetContractInfo,{
			SerialNo:SerialNo
		},function(data){
			if(data.Code == '0000'){
				let ContractType = data.ContractType;
				if(ContractType == 1){
					//电子合同
					var contractStyle = {
						electron:'active-contract',
						paper:''
					}	
				}else{
					//纸质合同
					var contractStyle = {
						electron:'',
						paper:'active-contract'
					}
				}
				that.setState({
					contractStyle:contractStyle,
					ContractType:ContractType,
					explain:electronExplain,
					imagelist:data.ContractImages,
					IsCompany:data.IsCompany,
					isCompany:data.IsCompany,
					CustomerName:data.CustomerName,
					CustomerPhone:data.CustomerPhone,
					SupplierName:data.SupplierName,
					SupplierContacter:data.SupplierContacter,
					ButtonList:data.ButtonList ? data.ButtonList : [],
					ContractId:data.ContractId,
					CustomerCertificateNo:data.CustomerCertificateNo,
					Status:data.Status
				});
			}else{
				app.showMsg(data.Msg);
			}
		});	
	},
	handleSwitch(){
		if(this.state.Status != 3){

			let status = $("#switch-active").attr('data-state');
			if(status == 'true'){
				$("#switch-active").removeClass('transform-switch-right');
				$("#switch-active").addClass('transform-switch-left');
				$("#switch-active").attr('data-state','false');
				this.setState({
					IsCompany:0
				})
			}else{
				$("#switch-active").removeClass('transform-switch-left');
				$("#switch-active").addClass('transform-switch-right');
				$("#switch-active").attr('data-state','true');
				this.setState({
					IsCompany:1
				})
			}
		}
	},
	handleNameChange(e){
		let value = e.target.value;
		this.setState({
			CustomerName:value
		})
	},
	handlePhoneChange(e){
		let value = e.target.value;
		this.setState({
			CustomerPhone:value
		})
	},
	handleCustomCard(e){
		let value = e.target.value;
		this.setState({
			CustomerCertificateNo:value
		})
	},
	handleConfirmContract(){
		//确认合同
		let CustomerName = this.state.CustomerName;
		let CustomerPhone = this.state.CustomerPhone;
		let IsCompany = this.state.IsCompany;

		let ContractId = this.state.ContractId;
		let ContractType = this.state.ContractType;
		let CustomerCertificateNo = this.state.CustomerCertificateNo;

		let query = this.props.location.query;
		let SerialNo = query.SerialNo;

		let isAgree = this.state.isAgree;

		if(isAgree == false){

			return;
		}

		if(IsCompany == 1){
			//是公司
			if(CustomerName == ''){
				app.showMsg("请输入公司名称");
				return;
			}
		}else{	
			//个人
			if(CustomerName == ''){
				app.showMsg("请输入个人姓名");
				return;
			}
			if(CustomerCertificateNo == ''){
				app.showMsg("请填写身份证或护照");
				return;
			}
		}
		if(CustomerPhone == ''){
			app.showMsg("请输入联系电话");
			return;
		}
		if(CustomerPhone.indexOf('-')>=0){
			//固定电话
			var areaCode = CustomerPhone.split('-')[0].toString();
			var phoneCode = CustomerPhone.split('-')[1].toString();
			if(areaCode.length != 4){
				app.showMsg("电话区号错误");
				return;
			}
			if(phoneCode.length != 8){
				app.showMsg("请填写正确的电话号码");
				return;
			}
		}else{
			//手机号
			if(!this.checkMobile(CustomerPhone)){
				app.showMsg("请输入正确的联系电话");
				return;
			}
			if(CustomerPhone.length!=11){
				app.showMsg("手机号码长度有误");
				return;
			}
		}
		app.Post(config.ConfirmContract,{
			ContractId:ContractId,
			ContractType:ContractType,
			IsCompany:IsCompany,
			CustomerName:CustomerName,
			CustomerPhone:CustomerPhone,
			CustomerCertificateNo:CustomerCertificateNo,
			SerialNo:SerialNo
		},function(data){
			if(data.Code == '0000'){
				app.showMsg("确认成功");
				history.push('/confirmContract');
				history.replace('/orderDetail?did='+SerialNo);
			}else{
				app.showMsg(data.Msg);
			}
		});
	},
	checkMobile(phone){
		var pattern = /^1[34578]\d{9}$/;
		return pattern.test(phone);
	},
	render(){
		let that = this;
		let peopleCard = '';
		
		let companyInput = '';
		let connactInput = '';
		let customCardInput = '';
		if(this.state.Status == 3){
			companyInput = <input placeholder='公司名称' 
								value={this.state.CustomerName} 
								onChange={this.handleNameChange}
								readOnly
							/>
			connactInput = <input placeholder='请填写联系手机号或座机号' value={this.state.CustomerPhone} onChange={this.handlePhoneChange} readOnly/>
			customCardInput = <input placeholder='请填写身份证或护照' value={this.state.CustomerCertificateNo} onChange={this.handleCustomCard} readOnly/>
		}else{
			companyInput = <input placeholder='公司名称' 
								value={this.state.CustomerName} 
								onChange={this.handleNameChange}
							/>
			connactInput = <input placeholder='请填写联系手机号或座机号' value={this.state.CustomerPhone} onChange={this.handlePhoneChange}/>
			customCardInput = <input placeholder='请填写身份证或护照' value={this.state.CustomerCertificateNo} onChange={this.handleCustomCard}/>
		}

		if(this.state.IsCompany == 1){
			peopleCard = '';
		}else{
			peopleCard = <div className='partya-info-list'>
							<div className='partya-info-list-key'>证件号码</div>
							<div className='partya-info-input'>
								{customCardInput}
							</div>
							<div className='clear'></div>
						</div>;
		}

		return (
			<div>
				<Title titleName={this.state.titleName}/>
				<div className='confirm-contract-title'>
					<div className={
						"confirm-contract-title-electron" + " " + this.state.contractStyle.electron
					} onClick={this.handleElectronContract}>电子合同</div>
					<div className={
						"confirm-contract-title-paper" + ' ' + this.state.contractStyle.paper
					} onClick={this.handlePapaerContract}>纸质合同</div>
					<div className='clear'></div>
				</div>
				<div className='confirm-contract-explain'>{this.state.explain}</div>
				<div className='partya'>
					<div className='partya-info'>甲方信息</div>
					<div className='partya-info-list'>
						<div className='partya-info-list-key'>是否公司</div>
						<div className='switch-container'>
							<div className={
								this.state.isCompany == 1 ? 'switch-active-company':'switch-active-person'
							} id='switch-active' data-state={
								this.state.isCompany == 1 ? 'true':'false'
							} onClick={this.handleSwitch}>
								<div className='switch-active-handle'></div>
							</div>
						</div>
						<div className='clear'></div>
					</div>
					<div className='partya-info-list'>
						<div className='partya-info-list-key'>签约主体</div>
						<div className='partya-info-input'>
							{companyInput}
						</div>
						<div className='clear'></div>
					</div>
					{peopleCard}
					<div className='partya-info-list border-bottom-none'>
						<div className='partya-info-list-key'>联系电话</div>
						<div className='partya-info-input'>
							{connactInput}
						</div>
						<div className='clear'></div>
					</div>
				</div>
				<div className='partya'>
					<div className='partya-info'>乙方信息</div>
					<div className='partya-info-list-key'>{this.state.SupplierName + ' ' +this.state.SupplierContacter}</div>
				</div>
				<div className='contract-file'>
					<img src={this.state.imageSrc} onClick={this.handleContract}/>
					<span className='contract-file-text'>
						我已阅读并认可合同内容
						<span className='book-color' onClick={this.showContract}> 《 李勇旅游合同 》 </span>
					</span>
				</div>
				<div style={this.state.preview}>
					<ImageView
						imagelist = {this.state.imagelist}
						current = {this.state.current}
						close = {this.handleCloseView}
					/>
				</div>
				{
					this.state.ButtonList.map(function(item){
						return <div className={
							that.state.isAgree == true ? 'submit-need':'not-submit-need'
						} key={item.Type} onClick={that.handleConfirmContract}>{item.Name}</div>
					})
				}
			</div>
		)
	}
});

export default ConfirmContract;