const endPlaceReducer = (state='',action) => {
	switch(action.type){
		case "End_PLACE_HOT":
			return action.data;
			break;
		case "ADD_SEARCH_HISTORY":
			return action.data;
			break;
		case "UPDATE_MANY_DEST_SEARCH":
			return action.data;
			break;
		case "CLEAR_SEARCH_HISTORY":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

export default endPlaceReducer;