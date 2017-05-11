import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers/rootReducer';
import app from '../config/public';

let initStore = {
	textName:[
		{
			Amount:'',
			Desc:'',
			Id:1
		}
	],
	customPackage:{
		startPlace:{
			Type:1,
			Id:[],
			Name:''
		},
		endPlace:[],
		customTime:['2017-05-07','2017-05-10'],
		time:{
			count: '',
			startMonth: '',
			startDay: '',
			endMonth: '',
			endDay: '',
			startWeek: '',
			endWeek: '',
		},
		previewTime:{
			count: '',
			startMonth: '',
			startDay: '',
			endMonth: '',
			endDay: '',
			startWeek: '',
			endWeek: '',
		},
		ticket:{
			adultNum:5,
			childrenNum:0
		},
		isChange:false,
	},
	startPlaceSearchHistory:[],
	startPlaceSelectHistory:[],
	startPlaceHotCity:[],
	startPlaceSearch:[],
	customEndPlace:{
		historySearch:[],
		selectHistory:[],
		hotCity:[],
		searchResult:[]
	},
	orderListResult:{
		Code:"",
		Msg:"",
		OrderList:[]
	}
};

let settings = app.getLocalStore();
let isEmpty = app.isEmptyObject(settings);
if(isEmpty == false){
	initStore = app.getLocalStore();
}else{
	app.setLocalStore(initStore);
}

let store = createStore(
	reducers,
	initStore,
	applyMiddleware(thunk)
)

export default store;