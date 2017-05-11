import app from '../config/public';

const hotCityAsync = () => {
	return function(dispatch, getState){
		app.Post('Search/GetDestinationList',{
			DestReqType:'hot'
		},function(data){
			dispatch(hotCity(data.DestList));
		})
	}
}

const hotCity = (data) => {
	return {
		type:'START_PLACE_HOT',
		data
	}
}

const updateStartPlace = (data, custom) => {
	let newData = app.getCloneObject(custom);
	let ids = []; ids.push(data.CityId);
	newData.startPlace = {Type:data.Type,Id:ids,Name:data.Name};
	return {
		type:'UPDATE_START_PLACE',
		newData
	}
}

const updateHotCity = (data) => {
	return {
		type:'UPDATE_HOT_CITY',
		data
	}
}

const searchCity = (key, type, cb) => {
	return function(dispatch, getState){
		app.Post('Search/SearchDestinationList',{
			Type:type,
			key:key
		},function(data){
			if(data.Code == '0000'){
				dispatch(updateSearchCity(data.DestList));
				cb(true);
			}else{
				dispatch(updateSearchCity([]));
				cb(false);
			}
		})
	}
}

const updateSearchCity = (data) => {
	return {
		type:'SEARCH_CITY',
		data
	}
}

const updateSearchHistory = (data) => {
	return {
		type:'SEARCH_HISTORY',
		data
	}
}


export default {
	hotCityAsync,
	updateStartPlace,
	updateHotCity,
	searchCity,
	updateSearchHistory
}