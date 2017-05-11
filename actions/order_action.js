import app from '../config/public';
import apiconfig from '../config/apiconfig'

const OrderListAsync = (type,page,callback) => {
	return function(dispatch, getState){
		app.Post(apiconfig.GetHotelOrderList,{
			Type: type,
			Page: {
				Index: page,
				size: apiconfig.PageSize
			}
		},function(data){
			dispatch(GetOrderList(data.DestList));
		})
	}
}

const GetOrderList = (data) => {
	return {
		type:'GetOrderListByType',
		data
	}
}

export default {
	OrderListAsync
}

