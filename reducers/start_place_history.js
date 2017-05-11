const select = (state='',action) => {
	switch(action.type){
		case "UPDATE_HOT_CITY":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

const search = (state='',action) => {
	switch(action.type){
		case "SEARCH_HISTORY":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

const searchResult = (state='',action) => {
	switch(action.type){
		case "SEARCH_CITY":
			return action.data;
			break;
		default:
			return state;
			break;
	}
}

export default {
	select,
	search,
	searchResult
}