import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, hashHistory } from 'react-router';
import IndexPage from './components/index';
import FirstPage from './components/first_page';
import SecondPage from './components/second_page';
import LocationPage from './components/location';
import OrderDetail from './components/order_detail';
import PersonPage from './components/person';
import OrderList from './components/order_list';
//import OrderCenter from './components/order_center';
import LoginPage from './components/login';
import RegisterPage from './components/register';
import ForgetPage from './components/forget';
import store from './store/store';
import Cashier from './components/cashier';
import TravelPlan from './components/travel_plan';
import ConfirmContract from './components/confirm_contract';
import PaySuccess from './components/pay_success';
import PayError from './components/pay_error';
import StartPlace from './components/start_place';
import ChangePassword from './components/change_password';
import ChangeInfo from './components/change_info';
import TravelNeedDetail from './components/travel_need_detail';
import PersonCenter from './components/person_center';
import './style/common.css';

render (
	<Provider store={store} >
		<Router history={ hashHistory }>
			<Route path='/' component={ IndexPage }></Route>
			<Route path='/first' component={ FirstPage }></Route>
			<Route path='/second' component={ SecondPage }></Route>
			<Route path='/startPlace' component={ StartPlace }></Route>
			<Route path='/location' component={ LocationPage }></Route>
			<Route path='/orderDetail' component={ OrderDetail }></Route>
			<Route path='/orderList' component={ OrderList }></Route>
			<Route path='/person' component={ PersonPage }></Route>
			<Route path='/cashier' component={ Cashier }></Route>
			<Route path='/login' component={ LoginPage }></Route>
			<Route path='/travelPlan' component={ TravelPlan }></Route>
			<Route path='/register' component={ RegisterPage }></Route>
			<Route path='/forget' component={ ForgetPage }></Route>
			<Route path='/confirmContract' component={ ConfirmContract }></Route>
			<Route path='/paySuccess' component={ PaySuccess }></Route>
			<Route path='/changepassword' component={ ChangePassword }></Route>
			<Route path='/changeinfo' component={ ChangeInfo }></Route>
			<Route path='/payError' component={ PayError }></Route>
			<Route path='/travelNeedDetail' component={ TravelNeedDetail }></Route>
			<Route path='/personCenter' component={ PersonCenter }></Route>
		</Router>
	</Provider>,
	document.getElementById('root'),
	function(){
		console.log('react SPA run success');
	}
)

