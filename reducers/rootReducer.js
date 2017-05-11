import { combineReducers } from 'redux';
import indexReducer from './index_reducer';
import startPlaceReducer from './start_place';
import startPlaceHistoryReducer from './start_place_history';
import endPlaceReducer from './end_place_reducer';
import orderListReducer from './orderlist_reducer';

const textNameReducer = (state='',action) => {
	switch(action.type){
		case "CHANGE_TEXT_NAME":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

let rootReducer = combineReducers({
	textName:textNameReducer,
	customPackage:indexReducer,
	startPlaceSelectHistory:startPlaceHistoryReducer.select,
	startPlaceHotCity:startPlaceReducer,
	startPlaceSearchHistory:startPlaceHistoryReducer.search,
	startPlaceSearch:startPlaceHistoryReducer.searchResult,
	customEndPlace:endPlaceReducer,
	orderListResult:orderListReducer
});

export default rootReducer;