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
		let localStore = app.getLocalStore();
		let selectHistory = localStore.customEndPlace.selectHistory;
		let searchHistory = localStore.customEndPlace.historySearch;
		return {
			hotContainer:"box_list",
			historySearchContainer:'box_list none',
			searchResultContainer:'box_list',
			notFound:'box_list none',
			defaultValue:'',
			hot:[],
			selectHistory:selectHistory,
			searchResult:[],
			searchHistory:searchHistory
		}
	},
	componentDidMount() {
		let that = this;
		//热门城市
		app.Post('Search/GetDestinationList',{
			'DestReqType':'hot'
		},function(data){
			if(data.Code == '0000'){
				that.setState({
					hot:data.DestList
				});
			}
		});
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
	addHistory(list){
		let selectHistory = this.state.selectHistory;
		if(this.checkIsSelect(selectHistory,list.Id) == false){
			selectHistory.push(list);
		}
		this.setState({
			selectHistory:selectHistory
		})
	},
	deleteHistoryCity(list){
		let selectHistory = this.state.selectHistory;
		selectHistory.forEach(function(value, index){
			if(value.Id == list.Id){
				selectHistory.splice(index,1);
			}
		});
		this.setState({
			selectHistory:selectHistory
		})
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
			app.Post('Search/SearchDestinationList',{
				Type:1,
				key:value
			},function(data){
				if(data.Code == '0000'){
					that.resetState(value,1);
					that.setState({
						searchResult:data.DestList
					})
				}else{
					that.resetState(value,0);
					that.setState({
						searchResult:[]
					})
				}
			});
		}else{
			that.resetState('',1);
		}
	},
	resetState(value, flag){
		if(flag == 0){
			this.setState({
				hotContainer:"box_list none",
				historySearchContainer:'box_list none',
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
	handleSearchList(list){
		let selectHistory = this.state.selectHistory;
		let queryDom = document.getElementById('searchList'+list.Id);
		let num = queryDom.getAttribute('data-num');
		let id = list.Id;
		if(num == '1'){
			//取消
			queryDom.setAttribute('class','result_item');
			queryDom.setAttribute('data-num','0');
			selectHistory.forEach(function(item,index){
				if(item.Id == id){
					selectHistory.splice(index,1);
				}
			})
		}else{
			//添加
			queryDom.setAttribute('class','result_item at');
			queryDom.setAttribute('data-num','1');
			selectHistory.push(list);
		}
		this.setState({
			selectHistory:selectHistory
		})
	},
	confirmSelect(){
		let that = this;
		let searchHistory = this.state.searchHistory;
		//确认
		let searchResult = this.state.searchResult;
		searchResult.map(function(item){
			let queryDom = document.getElementById('searchList'+item.Id);
			let num = queryDom.getAttribute('data-num');
			if(num == 1){
				if(that.checkIsSelect(searchHistory,item.Id) == false){
					searchHistory.push(item);
				}
			}
		});
		let selectHistory = this.state.selectHistory;
		let custom = app.getCloneObject(this.props.custom);
		custom.endPlace = selectHistory;
		this.props.dispatch(actions.indexAction.updateEndPlace(custom));

		let localStore = app.getLocalStore();
		localStore.customPackage = custom;
		localStore.customEndPlace.selectHistory = selectHistory;
		localStore.customEndPlace.historySearch = searchHistory;
		app.setLocalStore(localStore)

		history.replace('/');
	},
	handleHistorySelect(list){
		//历史选择
		let selectHistory = this.state.selectHistory;
		let queryDom = document.getElementById('history-list'+list.Id);
		let num = queryDom.getAttribute('data-num');
		let id = list.Id;
		if(num == '1'){
			//取消
			queryDom.setAttribute('class','result_item');
			queryDom.setAttribute('data-num','0');
			selectHistory.forEach(function(item,index){
				if(item.Id == id){
					selectHistory.splice(index,1);
				}
			})
		}else{
			//添加
			queryDom.setAttribute('class','result_item at');
			queryDom.setAttribute('data-num','1');
			selectHistory.push(list);
		}
		this.setState({
			selectHistory:selectHistory
		})
	},
	clearSearchHistory(){
		//清除历史
		let searchHistory = this.state.searchHistory;
		searchHistory = [];
		this.setState({
			searchHistory:searchHistory
		});
		let localStore = app.getLocalStore();
		localStore.customEndPlace.historySearch = [];
		app.setLocalStore(localStore);
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
	render(){
		let that = this;
		let clearHistoryDom = '';
		if(this.state.searchHistory.length >0){
			clearHistoryDom = <div className="result_clear" onClick={this.clearSearchHistory}><span>清除搜索历史</span></div>;
		}
		return (
			<div>
                <div className="head_top dosearch">
                    <div className="back none"></div>
                    <input type="text" 
                        className="input" 
                        placeholder="请输入出发地(如苏州/suzhou/sz)"
                        defaultValue=''
                        onFocus={this.handleFocus}
                        onCompositionStart={this.handleCompositionstart}
                        onCompositionEnd={this.handleCompositionEnd}
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
                            		this.state.hot.map(function(item){
                            			if(that.checkIsSelect(that.state.selectHistory,item.Id)){
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
                    		this.state.searchResult.map(function(item){
                    			if(that.checkIsSelect(that.state.selectHistory,item.Id) == true){

	                    			return <div className='result_item at' key={item.Id} id={'searchList'+item.Id} data-num='1' onClick={that.handleSearchList.bind(null,item)}>
					                            <p className="result_name">{item.Name}</p>
					                            <p className="result_place">{item.Desc}</p>
					                        </div>
                    			}else{
                    				return <div className='result_item' key={item.Id} id={'searchList'+item.Id} data-num='0' onClick={that.handleSearchList.bind(null,item)}>
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
                        		this.state.searchHistory.map(function(item){
                        			if( that.checkIsSelect(that.state.selectHistory,item.Id) == true ){
                        				return <div className='result_item at' key={item.Id} data-num='1' id={'history-list'+item.Id} onClick={that.handleHistorySelect.bind(null,item)}>
	                                                <p className="result_name">{item.Name}</p>
	                                                <p className="result_place">{item.Desc}</p>
	                                            </div>
                        			}else{

	                        			return <div className='result_item' key={item.Id} data-num='0' id={'history-list'+item.Id} onClick={that.handleHistorySelect.bind(null,item)}>
	                                                <p className="result_name">{item.Name}</p>
	                                                <p className="result_place">{item.Desc}</p>
	                                            </div>
                        			}
                        		})
                        	}
                           						
                            {clearHistoryDom}
                        </div>
                    </div>
                </div>
                <div className="fix_bottom">
                    <div className="fix_wrapper">
                        <div className={
                        	this.state.selectHistory.length > 0 ? 'fix_citys':'no-padding'
                        }>
                        	{
                        		this.state.selectHistory.map(function(item){

                           			return	<span className="city_item" key={item.Id}>
                           						{item.Name}
                                                <i onClick={that.deleteHistoryCity.bind(null,item)}></i>
                                            </span>
                        		})
                        	}
                            <div className={
                            	this.state.selectHistory.length > 0 ? 'city_arrow':'none'
                            }></div>
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