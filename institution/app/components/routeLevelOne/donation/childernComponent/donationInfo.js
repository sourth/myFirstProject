import React from 'react';
import {sendAjax,isOrderNumber,isVal} from '../../../../../lib/commonEvent';
import {uploadImage} from '../../../../../lib/upload';

export default class DonationInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            information:{},
            isShow:{
                display:''
            }
        };
    }
    render(){
        return(<div id="donationInfo" style={{display:'none'}}>
            <div className="backBtn">
                <span onClick={this.backList.bind(this)}>善款管理列表</span>
                <span className="noChange">></span>
                <span>善款管理详情</span>
            </div>
            <div className="donationInfoMain">
                <table className="projectRouteTable tableOne">
                    <tbody>
                    <tr>
                        <td>活动/项目名称</td>
                        <td>{this.state.information.title}</td>
                    </tr>
                    <tr>
                        <td>申请日期</td>
                        <td>{this.state.information.created_at}</td>
                    </tr>
                    <tr>
                        <td>活动/项目总额</td>
                        <td>{this.state.information.total_money?this.state.information.total_money:'0.00'}元</td>
                    </tr>
                    <tr>
                        <td>提取金额</td>
                        <td>{this.state.information.money}元</td>
                    </tr>
                    {/*<tr>
                        <td>剩余额</td>
                        <td>{this.state.information.contacts}</td>
                    </tr>*/}
                    <tr>
                        <td>手机号</td>
                        <td>
                            {this.state.information.mobile}
                        </td>
                    </tr>
                    <tr>
                        <td>审核状态</td>
                        <td>{this.state.information.status==2?'拒绝':this.state.information.status==1?'通过':'待审核'}</td>
                    </tr>
                    <tr style={this.state.isShow}>
                        <td>快递单号</td>
                        <td><input type="text" ref="express_number" style={{height:'28px'}}/></td>
                    </tr>
                    <tr>
                        <td>资金接收单</td>
                        <td className="uploadBox">
                            <a href={this.state.information.funds_receipt?this.state.information.funds_receipt:'javascript:;'} target="_blank" className="underLine">{this.state.information.funds_receipt?'查看':'未上传'}</a>
                            <a href="http://smartemple.oss-cn-qingdao.aliyuncs.com/donateForLove/%E4%B8%BA%E7%88%B1%E8%81%94%E5%8A%9D%E8%B5%84%E9%87%91%E6%8E%A5%E6%94%B6%E5%8D%95.doc" className="ReceiptFundsModel">点击下载模板</a>
                            <span id="uploadReceiptFunds" title="上传填写后的资金接收单图片" style={this.state.isShow}>点击上传</span>
                            <b id="uploadHide1" style={{display:'none'}}></b>
                            <b id="uploadHide2" style={{display:'none'}}></b>
                        </td>
                    </tr>
                    <tr>
                        <td>发票票据</td>
                        <td className="uploadBox">
                            <a href={this.state.information.receipt?this.state.information.receipt:'javascript:;'} target="_blank" className="underLine">{this.state.information.receipt?'查看':'未上传'}</a>
                            <span id="uploadInvoice" title="上传发票票据图片" style={this.state.isShow}>点击上传</span>
                            <b id="uploadHide3" style={{display:'none'}}></b>
                            <b id="uploadHide4" style={{display:'none'}}></b>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="projectRouteTable tableTwo">
                    <tbody>
                    <tr>
                        <td>提取百分比</td>
                        <td>{this.state.information.ratio*100+'%'}</td>
                    </tr>
                    <tr>
                        <td>提取人</td>
                        <td>{this.state.information.contact}</td>
                    </tr>
                    <tr>
                        <td>开户姓名</td>
                        <td>{this.state.information.account}</td>
                    </tr>
                    <tr>
                        <td>开户银行</td>
                        <td>{this.state.information.bank_name}</td>
                    </tr>
                    <tr>
                        <td>银行卡号</td>
                        <td>{this.state.information.bank_number}</td>
                    </tr>
                    <tr style={{display:this.state.information.reason?'':'none'}}>
                        <td>拒绝原因</td>
                        <td>{this.state.information.reason}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="pickUpMoney" onClick={this.sendMessage.bind(this)} style={this.state.isShow}>
                提交
            </div>
        </div>)
    }
    componentDidMount(){
        uploadImage('uploadReceiptFunds','uploadHide1',this,2,'uploadHide2');
        uploadImage('uploadInvoice','uploadHide3',this,2,'uploadHide4');
    }
    backList(){
        $("#donationList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.donationId!=0){
            this.getInformation(nextProps.donationId)
        }
    }
    getInformation(id){
        let token = sessionStorage.getItem('token');
        let self = this;
        id = id || 0;
        sendAjax({
            type:'POST',
            url:'admin/withdraw/findWithdraw',
            data:{
                token:token,
                id:id
            },
            success:function(data){
                if(data.code==200){
                    if(data.withdraw.status==1){
                        self.setState({
                            isShow:{
                                display:''
                            }
                        })
                    }else{
                        self.setState({
                            isShow:{
                                display:'none'
                            }
                        })
                    }
                   self.setState({
                       information:data.withdraw,
                       uploadInvoice:data.withdraw.receipt,
                       uploadReceiptFunds:data.withdraw.funds_receipt
                   },function(){
                       self.refs.express_number.value = data.withdraw.express_number;
                   })
                }
            }
        })
    }
    sendMessage(){
        let token = sessionStorage.getItem('token');
        let sendData = {}
        let id = this.props.donationId;
        sendData.id = id;
        sendData.token = token;
        if(this.state.uploadReceiptFunds){
            sendData.funds_receipt = this.state.uploadReceiptFunds;
        }else{
            sendData.funds_receipt = '';
        }
        if(this.state.uploadInvoice){
            sendData.receipt = this.state.uploadInvoice;
        }else{
            sendData.receipt = '';
        }
        if(isVal(this.refs.express_number.value)!='' && !isOrderNumber(this.refs.express_number.value)){
            alert('订单号不正确，请核对后重新填写！');
            return;
        }
        sendData.express_number = this.refs.express_number.value;
        sendAjax({
            type:'POST',
            url:'admin/withdraw/editWithdraw',
            data:sendData,
            success:function(data){
                if(data.code==200){
                    alert('提交成功！');
                    window.location.reload();
                }
            }
        })
    }
}
