import app from '../config/public';


const selectDateAction = (startTime, endTime, data) => {
	let datas = app.getCloneObject(data);
	let result = app.countTime(startTime, endTime);
	let customTime = [startTime,endTime];
	datas.customTime = customTime;
	datas.time = result;
	datas.previewTime = result;
	return {
		type:'CHANGE_TIME',
		datas
	}
}

const previewTimeAction = (startTime, endTime, data) => {
	let preview = app.getCloneObject(data);
	let result = app.countTime(startTime, endTime);
	preview.previewTime = result;
	return {
		type:'CHANGE_PREVIEW_TIME',
		preview
	}
}

const updateEndPlace = (data) => {
	console.log(data);
	return {
		type:'UPDATE_END_PLACE',
		data
	}
}

const updateSelectPeople = (ticket) => {
	return (dispatch, getState) => {
		let customPackage = app.getCloneObject(getState().customPackage);
		customPackage.ticket = ticket;
		dispatch(updatePeople(customPackage));
	}
}

const updatePeople = (people) => {
	return {
		type:'UPDATE_PEOPLE',
		people
	}
}

const updateIsChange = (isChange) => {
	return (dispatch, getState) => {
		let customPackage = app.getCloneObject(getState().customPackage);
		customPackage.isChange = isChange;
		dispatch(controlIsChange(customPackage));
	}
}
const controlIsChange = (data) => {
	return {
		type:'UPDATE_IS_CHANGE',
		data
	}
}

export default {
	selectDateAction,
	previewTimeAction,
	updateEndPlace,
	updateSelectPeople,
	updateIsChange
}