import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import styles from '../style/location.css';
import app from '../config/public';
import deepcopy from 'deepcopy';
import {createHashHistory} from 'history';

const history = createHashHistory();
let isSendRequest = true;

let LocationPage = React.createClass({
	getInitialState() {
		let data = this.props.location.query.data;
		data = JSON.parse(data);

		let newData = deepcopy(this.props.customEndPlace);
		console.log(newData);
		//底部搜索池历史
		let selectHistory = newData.selectHistory;

		//搜索历史
		let historySearch = newData.historySearch;

		return {
			endPlaceCity:data,
			historySearch:historySearch,
			newData:newData,
			selectHistory:selectHistory,
			hotContainer:"box_list",
			historySearchContainer:'box_list none',
			searchResultContainer:'box_list',
			notFound:'box_list none',
			defaultValue:''
		}
	},
	componentDidMount() {
		this.resetState('',1);
		this.props.dispatch(actions.endPlaceAction.getHotCityAsync());
		let selectHistory = this.state.selectHistory;	
		let historySearch = this.state.historySearch;
		let result = app.handleEndPlaceData(historySearch,selectHistory);
		this.setState({
			historySearch:result
		})
	},
	addHistory(list){
		let selectHistory = this.state.selectHistory;
		if(this.checkIsSelect(selectHistory,list.Id) == false){
			//list.isSelect = 1;
			selectHistory.push(list);
			this.setState({
				selectHistory:selectHistory
			})
		}
	},
	confirmSelect(){
		let that = this;
		let historySearch = this.state.historySearch;
		//确认选择
		let selectHistory = this.state.selectHistory;
		let custom = app.getCloneObject(this.props.custom);
		custom.endPlace = selectHistory;
		this.props.dispatch(actions.indexAction.updateEndPlace(custom));
		this.props.dispatch(actions.endPlaceAction.addHistoryAction(this.state.newData));

		

		let localStore = app.getLocalStore();
		localStore.customPackage = custom;
		localStore.customEndPlace.selectHistory = selectHistory;

		selectHistory.map(function(item){
			if(item.isFromSearch){
				if(that.checkIsSelect(historySearch,item.Id) == false){
					historySearch.push(item);
				}
			}
		})

		localStore.customEndPlace.historySearch = historySearch;
		app.setLocalStore(localStore)

		history.replace('/');
	},
	deleteHistoryCity(list){
		//删除已选
		let selectHistory = this.state.selectHistory;
		selectHistory.forEach(function(value, index){
			if(value.Id == list.Id){
				selectHistory.splice(index,1);
			}
		});
		this.setState({
			selectHistory:selectHistory
		})
		console.log(this.props.customEndPlace)
	},
	checkIsSelect(data,id){
		let status = false;
		data.map(function(list){
			if(list.Id == id){
				status = true;
			}
		});
		return status;
	},
	handleFocus(e){
		let value = e.target.value;
		//获取焦点时
		if(value == ''){
			this.setState({
				hotContainer:'box_list none',
				historySearchContainer:'box_list',
				searchResultContainer:'box_list none',
				notFound:'box_list none'
			})
		}else{
			this.setState({
				hotContainer:'box_list none',
				historySearchContainer:'box_list none'
			})
		}
	},
	handleCompositionstart(){
		isSendRequest = false;
	},
	handleCompositionEnd(e){
		isSendRequest = true;
		let value = e.target.value;
		this.getSearchData(value);
	},
	handleChange(e){
		let value = e.target.value;
		
		if(isSendRequest){
			this.getSearchData(value);
		}
	},
	getSearchData(value){
		let that = this;
		if(value != ''){
			this.props.dispatch(actions.endPlaceAction.manyDestAction(value,this.state.selectHistory,function(flag){
				that.resetState(value,flag);
			}));
		}else{
			that.resetState('',1);
		}
	},
	resetState(value, flag){
		if(flag == 0){
			this.setState({
				hotContainer:"box_list none",
				historySearchContainer:'box_list',
				searchResultContainer:'box_list none',
				notFound:'box_list'
			});
		}else{
			if(value == ''){
				//显示初始化时候的样式
				this.setState({
					hotContainer:"box_list",
					historySearchContainer:'box_list none',
					searchResultContainer:'box_list none',
					notFound:'box_list none'
				});
			}else{
				this.setState({
					hotContainer:"box_list none",
					historySearchContainer:'box_list none',
					searchResultContainer:'box_list',
					notFound:'box_list none'
				});
			}
		}
	},
	handleCancle(){
		this.setState({
			hotContainer:"box_list",
			historySearchContainer:'box_list none',
			searchResultContainer:'box_list none',
			notFound:'box_list none',
			defaultValue:''
		})
	},
	handleSearchList(list){
		//选择，取消
		let isSelect = list.isSelect;
		if(isSelect == 1){
			//取消
			list.isSelect = 0;
			//更新当前搜索池
			this.updateSearchHistoryBtm(0,list);
		}else{
			//添加选择
			list.isSelect = 1;
			//更新当前搜索池
			this.updateSearchHistoryBtm(1,list);
		}
		
		this.props.dispatch(actions.endPlaceAction.changeSelectStatus(list));
		
	},
	updateSearchHistoryBtm(isSelect,list){
		let selectHistory = this.state.selectHistory;
		if(isSelect == 0){
			//删除
			selectHistory.forEach(function(value,index){
				if(value.Id == list.Id){
					selectHistory.splice(index,1);
				}
			})
		}else{
			//添加
			list.isFromSearch = true;
			selectHistory.push(list);
		}
		this.setState({
			selectHistory:selectHistory
		})
	},
	handleHistoryTap(list){
		//处理历史新增和去除
		let historySearch = this.state.historySearch;
		if(list.isSelect == 1){
			//取消
			historySearch.forEach(function(item,index){
				if(list.Id == item.Id){
					historySearch[index].isSelect = 0;
				}
			})
		}else{
			//添加
			historySearch.forEach(function(item,index){
				if(list.Id == item.Id){
					historySearch[index].isSelect = 1;
				}
			})
		}
		this.setState({
			historySearch:historySearch
		});
		this.updateSearchHistoryBtm(list.isSelect,list);
	},
	render(){
		let that = this;
		let clearHistoryDiv = '';
		if(this.state.historySearch.length>0){
			clearHistoryDiv = <div className="result_clear"><span>清除搜索历史</span></div>
		}
		return (
			<div>
				<div className="head_top dosearch">
					<div className="back none"></div>
					<input type="text" 
						className="input" 
						placeholder="请输入出发地(如苏州/suzhou/sz)"
						defaultValue={this.state.defaultValue}
						onCompositionStart={this.handleCompositionstart}
						onCompositionEnd={this.handleCompositionEnd}
						onFocus={this.handleFocus}
						onInput={this.handleChange}
					/>
					<div className="cancel" onClick={this.handleCancle}>取消</div>
				</div>
				<div className='container'>
					<div className={this.state.hotContainer}>
						<div className="box">
							<div className="box_tit">热门</div>
							<div className="box_cont">
								{
									this.props.customEndPlace.hotCity.map(function(item){
										if(that.checkIsSelect(that.state.selectHistory,item.Id) == true){
											return <a className="option_btn current-city" key={item.Id} onClick={that.addHistory.bind(null,item)}>{item.Name}</a>	
										}else{
											return <a className="option_btn" key={item.Id} onClick={that.addHistory.bind(null,item)}>{item.Name}</a>	
										}
									})
								}
							</div>
						</div>
					</div>
					<div className={this.state.searchResultContainer}>
						{
							this.props.customEndPlace.searchResult.map(function(item){
								if(item.isSelect == 1){
									return <div className='result_item at' key={item.Id} onClick={that.handleSearchList.bind(null,item)}>
												<p className="result_name">{item.Name}</p>
												<p className="result_place">{item.Desc}</p>
											</div>
								}else{

									return <div className='result_item' key={item.Id} onClick={that.handleSearchList.bind(null,item)}>
												<p className="result_name">{item.Name}</p>
												<p className="result_place">{item.Desc}</p>
											</div>
								}
							})
						}
					</div>
					<div className={this.state.notFound}>
						<div className="box">
							<div className="noresult">无搜索结果</div>
						</div>
					</div>
					<div className={this.state.historySearchContainer}>
						<div className="result_list">
							{
								this.state.historySearch.map(function(item){
									if( item.isSelect && item.isSelect == 1){
										return <div className='result_item at' key={item.Id} onClick={that.handleHistoryTap.bind(null,item)}>
														<p className="result_name">{item.Name}</p>
														<p className="result_place">{item.Desc}</p>
													</div>
									}else{

										return <div className='result_item' key={item.Id} onClick={that.handleHistoryTap.bind(null,item)}>
														<p className="result_name">{item.Name}</p>
														<p className="result_place">{item.Desc}</p>
													</div>
									}
								})
							}
							<div>
								{clearHistoryDiv}
							</div>
						</div>
					</div>
				</div>
				<div className="fix_bottom">
					<div className="fix_wrapper">
						<div className="fix_citys">
							{
								this.state.selectHistory.map(function(item){
									return <span className="city_item" key={item.Id}>{item.Name}
												<i onClick={that.deleteHistoryCity.bind(null,item)}></i>
											</span>
								})
							}
							<div className="city_arrow"></div>
						</div>
						<div className="sure_btn" onClick={this.confirmSelect}>确认</div>
					</div>
				</div>
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {
		customEndPlace:state.customEndPlace,
		custom:state.customPackage
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

LocationPage = connect(mapStateToProps)(LocationPage)

export default LocationPage;