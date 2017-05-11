import React from 'react';
import Title from './title';
import TravelIcon from '../images/lvxing.svg';
import HotelIcon from '../images/jiudian.svg';
 
let OrderList = React.createClass({
    getInitialState() {
        return {
            titleName:'订单列表'
        }    
    },
    render(){
        return (
            <div>
                <Title titleName={this.state.titleName}/>
                <div className='order-navigator'>
                    <div className='order-navigator-list active-navigator'>全部</div>
                    <div className='order-navigator-list'>待付款</div>
                    <div className='order-navigator-list'>待确认</div>
                    <div className='order-navigator-list'>待出行</div>
                    <div className='order-navigator-list'>退款</div>
                    <div className='clear'></div>
                </div>
                <div className='order-center-contents'>
                    <div className='order-center-list'>
                        <div className='order-center-list-left'>
                            <div className='order-center-list-left-container'>
                                <div className='order-center-list-title'>苏州到桂林，4天3晚可调整行程</div>
                                <div className='order-center-list-detail'>请我去我去我去我去我去我去去请我去我去我去我去我去我去去</div>
                            </div>
                        </div>
                        <div className='order-center-list-right'>
                            <div className='order-center-list-status'>设计中</div>
                        </div>
                        <div className='order-center-list-icon'>
                            <img src={TravelIcon}/>
                        </div>
                        <div className='clear'></div>
                    </div>
                    <div className='order-center-list'>
                        <div className='order-center-list-left'>
                            <div className='order-center-list-left-container'>
                                <div className='order-center-list-title'>苏州到桂林，4天3晚可调整行程</div>
                                <div className='order-center-list-detail'>请我去我去我去我去我去我去去请我去我去我去我去我去我去去</div>
                            </div>
                        </div>
                        <div className='order-center-list-right'>
                            <div className='order-center-list-status'>￥20.00</div>
                            <div className='order-center-list-price'>设计中</div>
                        </div>
                        <div className='order-center-list-icon'>
                            <img src={HotelIcon}/>
                        </div>
                        <div className='clear'></div>
                    </div>
                    <div className='order-center-list padding-btm'>
                        <div className='order-center-list-left'>
                            <div className='order-center-list-left-container'>
                                <div className='order-center-list-title'>苏州到桂林，4天3晚可调整行程</div>
                                <div className='order-center-list-detail'>请我去我去我去我去我去我去去请我去我去我去我去我去我去去</div>
                            </div>
                        </div>
                        <div className='order-center-list-right'>
                            <div className='order-center-list-status'>￥20.00</div>
                            <div className='order-center-list-price'>设计中</div>
                        </div>
                        <div className='order-center-list-icon'>
                            <img src={HotelIcon}/>
                        </div>
                        <div className='clear'></div>
                        <div className='order-center-list-pay'>
                            <div className='order-center-list-action'>支付全款</div>
                        </div>
                        <div className='clear'></div>
                    </div>
                </div>
            </div>
        )
    }
});
 
export default OrderList;