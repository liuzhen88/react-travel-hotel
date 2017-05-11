const indexReducer = (state='',action) => {
	switch(action.type){
		case "CHANGE_TICKET":
			return action.data;
			break;
		case "CHANGE_TIME":
			return action.datas;
			break;
		case "CHANGE_PREVIEW_TIME":
			return action.preview;
			break;
		case "UPDATE_START_PLACE":
			return action.newData;
			break;
		case "UPDATE_END_PLACE":
			return action.data;
			break;
		case "UPDATE_PEOPLE":
			return action.people;
			break;
		case "UPDATE_IS_CHANGE":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

export default indexReducer;