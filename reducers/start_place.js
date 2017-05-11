const startPlaceReducer = (state='',action) => {
	switch(action.type){
	 	case "CHANGE_HISTORY":
	 		return action.history;
	 		break;
	 	case "START_PLACE_HOT":
	 		return action.data;
	 		break;
		default:
			return state;
			break;
	}
}

export default startPlaceReducer;