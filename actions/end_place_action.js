import app  from '../config/public';

const getHotCityAsync = () => {
	return (dispatch, getState) => {
		app.Post('Search/GetDestinationList',{
			'DestReqType':'hot'
		},function(data){
			let endPlaceData = app.getCloneObject(getState().customEndPlace);
			endPlaceData.hotCity = data.DestList;
			dispatch(getHotelCity(endPlaceData));
		});
	}
}

const getHotelCity = (data) => {
	return {
		type:'End_PLACE_HOT',
		data
	}
}

const addHistoryAction = (data) => {
	return {
		type:'ADD_SEARCH_HISTORY',
		data
	}
}

const manyDestAction = (key, selectHistory, cb) => {
	return (dispatch, getState) => {
		let customEndPlace = app.getCloneObject(getState().customEndPlace);
		app.Post('Search/SearchDestinationList',{
			Type:1,
			key:key
		},function(data){
			if(data.Code == '0000'){
				let result = app.handleEndPlaceData(data.DestList,selectHistory);
				customEndPlace.searchResult = result;
				dispatch(manyDest(customEndPlace));
				cb(1);
			}else{
				customEndPlace.searchResult = [];
				dispatch(manyDest(customEndPlace));
				cb(0);
			}
		})
	}
}

const manyDest = (data) => {
	return {
		type:'UPDATE_MANY_DEST_SEARCH',
		data
	}
}

const changeSelectStatus = (list) => {
	return (dispatch, getState) => {
		let customEndPlace = app.getCloneObject(getState().customEndPlace);
		customEndPlace.searchResult.forEach(function(value, index){
			if(value.Id == list.Id){
				customEndPlace.searchResult[index] = list;
			}
		});
		dispatch(manyDest(customEndPlace));
	}
}

const deleteSearchHistory = () => {
	return (dispatch, getState) => {
		let customEndPlace = app.getCloneObject(getState().customEndPlace);
		customEndPlace.historySearch = [];
		dispatch(deleteHistory(customEndPlace));
	}
}
const deleteHistory = (data) => {
	return {
		type:'CLEAR_SEARCH_HISTORY',
		data
	}
}

export default {
	getHotCityAsync,
	addHistoryAction,
	manyDestAction,
	changeSelectStatus,
	deleteSearchHistory
}