import app  from '../config/public';
import indexAction from './index_action';
import startPlaceAction from './start_place_action';
import endPlaceAction from './end_place_action';
import orderListAction from './order_action';

let textNameAction = (data) => {
	return {
		type:'CHANGE_TEXT_NAME',
		data:data
	}
}

let textNameActionAsync = () => {
	return function(dispatch, getState){
		app.Post('getHotelArea',{},function(data){
			dispatch(textNameAction(data.BrandList));
		})
	}
}

export default {
	textNameActionAsync,
	indexAction,
	startPlaceAction,
	endPlaceAction,
	orderListAction
}