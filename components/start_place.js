import React from 'react';
import actions from '../actions/action';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {createHashHistory} from 'history';
import app from '../config/public';
import config from '../config/apiconfig';

const history = createHashHistory();
let isSendRequest = true;

let StartPlace = React.createClass({
	getInitialState() {
		let query = this.props.location.query;
		let queryData = JSON.parse(query.data);
		let cityId = queryData.Id[0];
		return {
			cityId:cityId,
			type:queryData.Type,
			searchContent:'box_list none',
			initContainer:'box_list',
			searchHistory:'search-history none',
			searchResult:'search-result-container none',
			position:{
				CityId:'',
				Name:'',
				Id:''
			}
		}	
	},
	componentDidMount() {
		let that = this;
		this.props.dispatch(actions.startPlaceAction.hotCityAsync());
		this.handlePosition(function(result){
			that.setState({
				position:{
					CityId:result.CityId,
					Name:result.Name,
					Id:result.Id
				}
			});
		});
	},
	handlePosition(callback){
		let that = this;
		var myCity = new BMap.LocalCity();
		myCity.get(function(result){
			var name = result.name;
			app.Post(config.GetDestinationList,{
				DestReqType:'current',
				DestList:[
					{
						Type:1,
						Id:0,
						Name:name
					}
				]
			},function(data){
				if(data.Code == '0000'){
					let result = data.DestList[0];
					callback(result);
				}else{
					that.setState({
						position:{
							CityId:'',
							Name:'定位失败',
							Id:''
						}
					});
				}
			});
		});
	},
	handlePositionCity(){
		let that = this;
		let position = this.state.position;
		if(position.CityId == ''){
			//定位失败，再次定位
			this.handlePosition(function(result){
				that.setState({
					position:{
						CityId:result.CityId,
						Name:result.Name,
						Id:result.Id
					}
				});
			});
		}else{
			//定位成功直接跳
			this.handleHotCity(position);
		}
	},
	handleHotCity(data){
		let searchHitory = this.props.searchHitory;
		let localStore = app.getLocalStore();
		let selectCityAssemble = this.props.historyCity;
		this.props.dispatch(actions.startPlaceAction.updateStartPlace(data,this.props.custom));
		
		if(this.checkCityIsSelect(selectCityAssemble,data.CityId) == false){
			let arr = [];
			selectCityAssemble.map(function(item){
				arr.push(item);
			});
			arr.push(data);
			let newArr = this.getSortArray(arr);
			this.props.dispatch(actions.startPlaceAction.updateHotCity(newArr));

			localStore.startPlaceSelectHistory = newArr;
		}

		/*
			add hot data into search history
		*/
		if(this.checkCityIsSelect(searchHitory,data.CityId) == false){
			let arr = [];
			searchHitory.map(function(d){
				arr.push(d);
			});
			arr.push(data);
			this.props.dispatch(actions.startPlaceAction.updateSearchHistory(arr));
			localStore.startPlaceSearchHistory = arr;
		}
		
		localStore.customPackage.startPlace = {
			Type:data.Type,
			Id:[data.Id],
			Name:data.Name
		};
		
		app.setLocalStore(localStore);
		history.replace('/');
	},
	getSortArray(arr){
		let newArr = [];
		if(arr.length>6){
			for(let i=arr.length-6;i<=arr.length-1;i++){
				newArr.push(arr[i]);
			}
		}else{
			newArr = arr;
		}
		return newArr;
	},
	sortArray(arr){
		let newArr = [];
		for(let i=arr.length-1;i>=0;i--){
			newArr.push(arr[i]);
		}
		return newArr;
	},
	checkCityIsSelect(data,id,isCountHistory){
		let status = false;
		data.map(function(list){
			if(list.CityId == id){
				status = true;
			}
		});
		if(isCountHistory){
			 
			if(id == this.state.cityId){
				status = true;
			}
		}
		return status;
	},
	resetState(value, flag){
		if(value == ''){
			this.setState({
				searchContent:'box_list none',
				initContainer:'box_list none',
				searchHistory:'search-history',
				searchResult:'search-result-container none'
			});
		}else{
			if(flag == 1){
				this.setState({
					searchContent:'box_list none',
					initContainer:'box_list none',
					searchHistory:'search-history none',
					searchResult:'search-result-container'
				});
			}else{
				this.setState({
					searchContent:'box_list',
					initContainer:'box_list none',
					searchHistory:'search-history none',
					searchResult:'search-result-container none'
				});
			}
		}
	},
	handleChange(e){
		let value = e.target.value;
		
		if(isSendRequest){
			this.sendSearch(value);
		}
	},
	handleCompositionstart(e){
		isSendRequest = false;
	},
	handleCompositionEnd(e){
		isSendRequest = true;
		let value = e.target.value;
		
		this.sendSearch(value);
	},
	sendSearch(value){
		let that = this;
		this.props.dispatch(actions.startPlaceAction.searchCity(value,this.state.type,function(isShow){
			if(isShow == false){
				that.resetState(value,0);
			}else{
				that.resetState(value,1);
			}
		}));
	},
	handleFocus(){
		this.setState({
			searchContent:'box_list none',
			initContainer:'box_list none',
			searchHistory:'search-history'
		});
	},
	selectSearchList(list){
		let searchHitory = this.props.searchHitory;
		let localStore = app.getLocalStore();
		
		//点击搜索结果
		this.props.dispatch(actions.startPlaceAction.updateStartPlace(list,this.props.custom));
		if(this.checkCityIsSelect(searchHitory,list.CityId) == false){
			let arr = [];
			searchHitory.map(function(d){
				arr.push(d);
			});
			arr.push(list);
			this.props.dispatch(actions.startPlaceAction.updateSearchHistory(arr));
			localStore.startPlaceSearchHistory = arr;
		}
		
		localStore.customPackage.startPlace = {
			Type:list.Type,
			Id:[list.Id],
			Name:list.Name
		};
		
		app.setLocalStore(localStore);
		history.replace('/');
	},
	cancleSelect(){
		this.setState({
			searchContent:'box_list none',
			initContainer:'box_list',
			searchHistory:'search-history none',
			searchResult:'search-result-container none'
		});
		$("#search-input").val('');
	},
	clearSearchHistory(){
		//清空搜索历史
		this.props.dispatch(actions.startPlaceAction.updateSearchHistory([]));
		let localStore = app.getLocalStore();
		localStore.startPlaceSearchHistory = [];
		app.setLocalStore(localStore);
	},
	render(){
		let that = this;
		let selectCityAssemble = this.props.historyCity;
		let historyTitleTag = <div></div>;
		if(selectCityAssemble.length>0){
			historyTitleTag = <div className="box_tit">历史选择</div>;
		}
		let clearHistory = <div></div>;
		if(this.props.searchHitory.length>0){
			clearHistory = <div className='clear-search-history' onClick={this.clearSearchHistory}>清除搜索历史</div>;
		}
		return (
			<div>
				<div className="head_top dosearch">
					<div className="back none"></div>
					<input type="search" 
						className="input" 
						placeholder="请输入出发地(如苏州/suzhou/sz)"
						defaultValue=''
						onCompositionEnd={this.handleCompositionEnd}
						onInput={this.handleChange}
						onCompositionStart={this.handleCompositionstart}
						onFocus={this.handleFocus}
						id='search-input'
					/>
					<div className="cancel" onClick={this.cancleSelect}>取消</div>
				</div>
				<div className="container">
					<div className={this.state.initContainer}>
						<div className='box'>
							<div className="box_tit">当前</div>
							<div className='box_cont'>
								<a className={
									this.state.position.Id == this.state.cityId ? 'option_btn current-city' : 'option_btn'
								} onClick={that.handlePositionCity}>{this.state.position.Name}</a> 
							</div>
						</div>
						<div className="box">
							<div className="box_tit">热门</div>
							<div className="box_cont">
								{
									this.props.hot.map(function(item){
										 
										if(item.Id == that.state.cityId){
											return  <a className="option_btn current-city" key={item.CityId} onClick={that.handleHotCity.bind(null,item)}>
														{item.Name}
													</a> 
										}else{
											return  <a className="option_btn" key={item.CityId} onClick={that.handleHotCity.bind(null,item)}>
														{item.Name}
													</a> 
										}
									})
								}
							</div>
						</div>
					</div>
					<div className={this.state.searchHistory}>
						{
							this.props.searchHitory.map(function(item){
								if(item.Id == that.state.cityId){
									return <div className='search-history-list active-word' key={item.Id} onClick={that.selectSearchList.bind(null,item)}>{item.Name}</div>
								}else{

									return <div className='search-history-list' key={item.Id} onClick={that.selectSearchList.bind(null,item)}>{item.Name}</div>
								}
							})
						}
						{clearHistory}
						
					</div>
					<div className={this.state.searchResult}>
						{
							this.props.searchData.map(function(item){
								if(item.Id == that.state.cityId){
									return <div className='search-history-list active-word' key={item.Id} onClick={that.selectSearchList.bind(null,item)}>{item.Name}</div>
								}else{

									return <div className='search-history-list' key={item.Id} onClick={that.selectSearchList.bind(null,item)}>{item.Name}</div>
								}
							})
						}
					</div>
					<div className={this.state.searchContent}>
						<div className="box">
							<div className="noresult">无搜索结果</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

const mapStateToProps = (state) => {
	return {
		hot:state.startPlaceHotCity,
		custom:state.customPackage,
		historyCity:state.startPlaceSelectHistory,
		searchHitory:state.startPlaceSearchHistory,
		searchData:state.startPlaceSearch
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		actions:bindActionCreators(actions,dispatch)
	}
}

StartPlace = connect(mapStateToProps)(StartPlace)

export default StartPlace;