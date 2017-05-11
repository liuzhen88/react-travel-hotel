const orderListReducer = (state='',action) => {
	switch(action.type){
	 	case "GetOrderListByType":
	 		return action.data;
	 		break;
	 	default :
			return state;
			break;
	}
}
export default orderListReducer;