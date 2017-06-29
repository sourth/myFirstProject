import React from 'react';
import {sendAjax} from '../../../../../lib/commonEvent';
export default class DonationHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            moneyCanWithdraw:-1,
            noMarginRight:{
            marginRight:'0'
        }
        }
    }
    render(){
        return(
            <div className="operationBar">
                <div className="checkAll">
                    <div className="activeItemsCheckGather" style={{backgroundImage:'none'}}>善款管理</div>
                </div>
                <form style={this.state.noMarginRight}>
                    <input type="text" placeholder="请输入关键字" className="keyWords" />
                    <h2 className="search" onClick = {this.props.searchDonation}>
                        <img src="img/search.jpg" />
                    </h2>
                </form>
                {/*<div id="delete" className="delete" onClick={this.deleteItems.bind(this)}>删除</div>*/}
                <div id="donationPickUp" className="compile" onClick={this.pickUpDonation.bind(this)}>提取善款</div>
                <div className="clearFloat"></div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){

    }
    componentDidMount(){
        let self = this;
        $('.operationBar').delegate('#specialDiv','click',function(){
            $('.operationBar').css('overflow','hidden');
            $(this).css('display','none');
        });
        this.getInformation();
    }
    getInformation(){
        let token = sessionStorage.getItem('token');
        let self = this;
        sendAjax({
            type:"POST",
            url:"admin/withdraw/findWithdrawList",
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200) {
                    self.setState({
                        moneyCanWithdraw:data.donationStatics.moneyCanWithdraw
                    })
                }
            }
        })
    }
    pickUpDonation(){
        if(this.state.moneyCanWithdraw==0||this.state.moneyCanWithdraw==-1){
            alert("没有可提取款项的项目和活动，不能提取！");
            return;
        }
        $('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
        $('.operationBar').css('overflow','hidden');
        $('.activeItemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
        $('#donationOperate').css('display','block').siblings().css('display','none');
    }
    checkToggle(){
        $('.activeItemsCheckGather').siblings('ul').toggleClass('hideItems');
    }
    changeItems(e){
        $('.activeItemsCheckGather').siblings('ul').addClass('hideItems');
        $('.activeItemsCheckGather').html($(e.target).text());
    }
    deleteItems(){
        if($('.tick').is(':checked')){
            $('#coverView').css('display','block');
        }
    }

}
