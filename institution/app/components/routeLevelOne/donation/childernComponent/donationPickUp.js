import React from 'react';
import {sendAjax,isVal,isOnlyMobile} from '../../../../../lib/commonEvent';
import {uploadImage} from '../../../../../lib/upload';
export default class DonationPickUp extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            isCodeTime: '发送验证码',
            isShowPercent: {
                display: 'block'
            },
            allProjects: [],
            allActivitys: [],
            nowItems: [],
            id: "",
            type: 1,
            totalMoney: 0.00,
            pickUpMoney: 0,
            ratio: 0.7,
            bankAccountInfo: {},
            isUnlimitedTarget: 1
        }
    }
    render(){
        return(<div id="donationOperate" style={{display:'none'}}>
            <div className="backBtn">
                <span onClick={this.backList.bind(this)}>善款管理列表</span>
                <span className="noChange">></span>
                <span>提取善款</span>
            </div>
            <div className="pickUpDonation">
                <div className="pickUpModel">
                    <span className="pickUpLeft">善款提取人</span>
                    <div className="pickUpRight">
                        <input type="text" ref="name"/>
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">项目/活动</span>
                    <div className="pickUpRight">
                        <select name="" id="" onChange={this.chooseItemType.bind(this)}>
                            <option value="1">项目</option>
                            <option value="2">活动</option>
                        </select>
                        <select name="" id="" className="allPro" onChange={this.chooseItemId.bind(this)}>
                            {
                                this.state.nowItems.map(function(item,i){
                                    return(<option key={i} value={item.id} data-ratio={item.ratio} data-totalMoney={item.total_money?item.total_money:0.00} data-endTime={item.end_time} data-target={item.target} data-money={item.money}>{item.title}</option>)
                                })
                            }
                        </select>
                    </div>
                </div>
                <div className="pickUpModel" style={this.state.isShowPercent} style={{display:this.state.isUnlimitedTarget==1?'block':'none'}}>
                    <span className="pickUpLeft">提取百分比</span>
                    <div className="pickUpRight">
                        {this.state.ratio*100+'%'}
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">提取金额</span>
                    <div className="pickUpRight">
                       <span className="" style={{display:this.state.isUnlimitedTarget==1?'block':'none',float:'left'}}>{this.state.pickUpMoney}元</span>
                        <input type="number" ref="pickUpNumber" style={{display:this.state.isUnlimitedTarget==1?'none':'block',width:'28%',float:'left'}}/>
                        <span className="totalMoney" style={{lineHeight:this.state.isUnlimitedTarget==1?'40px':'50px'}}>总金额：{this.state.totalMoney}元</span>
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">资金接收单</span>
                    <div className="pickUpRight uploadBox">
                        <a href={this.state.uploadReceiptFunds1?this.state.uploadReceiptFunds1:'javascript:;'} target="_blank" className="underLine">{this.state.uploadReceiptFunds1?'查看':'未上传'}</a>
                        <a href="http://smartemple.oss-cn-qingdao.aliyuncs.com/donateForLove/%E4%B8%BA%E7%88%B1%E8%81%94%E5%8A%9D%E8%B5%84%E9%87%91%E6%8E%A5%E6%94%B6%E5%8D%95.doc" className="ReceiptFundsModel">点击下载模板</a>
                        <span id="uploadReceiptFunds1" title="上传填写后的资金接收单图片">点击上传</span>
                        <b id="uploadHide5" style={{display:'none'}}></b>
                        <b id="uploadHide6" style={{display:'none'}}></b>
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">发票票据</span>
                    <div className="pickUpRight uploadBox">
                        <a href={this.state.uploadInvoice1?this.state.uploadInvoice1:'javascript:;'} target="_blank" className="underLine">{this.state.uploadInvoice1?'查看':'未上传'}</a>
                        <span id="uploadInvoice1" title="上传发票票据图片">点击上传</span>
                        <b id="uploadHide7" style={{display:'none'}}></b>
                        <b id="uploadHide8" style={{display:'none'}}></b>
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">开户姓名</span>
                    <div className="pickUpRight">
                        {this.state.bankAccountInfo.account}
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">银行卡号</span>
                    <div className="pickUpRight">
                        {this.state.bankAccountInfo.bank_number}
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">手机号</span>
                    <div className="pickUpRight">
                        <input type="tel" ref="mobile"/>
                    </div>
                </div>
                <div className="pickUpModel">
                    <span className="pickUpLeft">验证码</span>
                    <div className="pickUpRight">
                        <input type="text" className="getCode" ref="code"/>
                        <span className="sendIdentifyingCode" onClick={this.getCode.bind(this)}>
                            {this.state.isCodeTime}
                        </span>
                    </div>
                </div>
            </div>
            <div className="pickUpMoney" onClick={this.sendMessage.bind(this)}>
                申请
            </div>
        </div>)
    }
    componentDidMount(){
        this.getGroupAllChild();
        uploadImage('uploadReceiptFunds1','uploadHide5',this,2,'uploadHide6');
        uploadImage('uploadInvoice1','uploadHide7',this,2,'uploadHide8');
    }
    backList(){
        $("#donationList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
    }
    //申请提款
    sendMessage(){
        let token = sessionStorage.getItem('token');
        let sendData = {};
        let name = this.refs.name.value;
        if(isVal(name)==''){
            alert('善款提取人不能为空！');
            return;
        }
        sendData.contact = name;
        sendData.item_type = this.state.type;
        if(isVal(this.state.id)==''){
            alert("请选择一个项目或活动！");
            return;
        }
        sendData.item_id = this.state.id;
        if(this.state.uploadReceiptFunds1){
            sendData.funds_receipt = this.state.uploadReceiptFunds1;
        }else{
            sendData.funds_receipt = '';
        }
        if(this.state.uploadInvoice1){
            sendData.receipt = this.state.uploadInvoice1;
        }else{
            sendData.receipt = '';
        }
        let mobile = this.refs.mobile.value;
        if(!isOnlyMobile(mobile)){
            alert('手机号码不正确！');
            return;
        }
        sendData.mobile = mobile;
        sendData.code = this.refs.code.value;
        if(isVal(this.refs.code.value)==''){
            alert("验证码未填写！");
            return;
        }
        sendData.token = token;
        sendData.ratio = this.state.ratio;
        if(this.state.isUnlimitedTarget==2){
            if(isVal(this.refs.pickUpNumber.value)==''){
                alert('提取金额不能为空！');
                return;
            }else if(Number(this.refs.pickUpNumber.value)>Number(this.state.totalMoney)){
                alert('提取金额不能大于总金额！');
                return;
            }else if(Number(this.refs.pickUpNumber.value)<=0){
                alert('输入金额有误！');
                return;
            }else{
                sendData.money = this.refs.pickUpNumber.value
            }
        }else{
            sendData.money = this.state.pickUpMoney;
        }
        sendAjax({
            url:'admin/withdraw/addWithdraw',
            type:'POST',
            data:sendData,
            success:function(data){
                $("#coverBox").height('100%');
                $('#loader,#coverBox').hide();
                if(data.code==200){
                    alert('申请成功！');
                    window.location.reload();
                }else if(data.code==205&&data.message=='CAPTCHA_ERROR'){
                    alert("验证码不正确！");
                }else if(data.code==207&&data.message=='CAPTCHA_INVALID'){
                    alert('验证码失效，请重新获取！')
                }else{
                    alert(data.message)
                }
            },
            beforeSend: function(XMLHttpRequest){
                let height = document.getElementsByTagName('body')[0].scrollHeight;
                $("#coverBox").height(height+'px');
                $('#loader,#coverBox').show();
            },
            complete :function(XMLHttpRequest, TS){
                $("#coverBox").height('100%');
                $('#loader,#coverBox').hide();
            }
        })
    }
    //选择项目或活动
    chooseItemType(event){
        event = event || window.event;
        let projectList = this.state.allProjects;
        let activityList = this.state.allActivitys;
        if(event.target.value==2){
            this.setState({
                isShowPercent:{
                    display:'none'
                },
                type:2,
                nowItems:activityList
            })
            if(activityList.length>0){
                this.setState({
                    isUnlimitedTarget:1,
                    id:activityList[0].id,
                    ratio:activityList[0].ratio,
                    totalMoney:activityList[0].total_money?activityList[0].total_money:0.00,
                    pickUpMoney:activityList[0].total_money?activityList[0].total_money:0.00
                })
            }else{
                this.setState({
                    totalMoney:0.00,
                    ratio:0,
                    pickUpMoney:0.00
                })
            }
        }else{
            this.setState({
                isShowPercent:{
                    display:'block'
                },
                type:1,
                nowItems:projectList
            })
             if(projectList.length>0){
                 if(projectList[0].target=='0.00' || projectList[0].end_time=='2038-01-10 00:00:00'){
                     this.setState({
                         id:projectList[0].id,
                         isUnlimitedTarget:2,
                         totalMoney:projectList[0].total_money?projectList[0].total_money:0.00,
                         ratio:0
                     })
                 }else{
                     this.setState({
                         isUnlimitedTarget:1,
                         id:projectList[0].id,
                         ratio:projectList[0].ratio,
                         totalMoney:projectList[0].total_money?projectList[0].total_money:0.00,
                         pickUpMoney:projectList[0].money
                     })
                 }
            }else{
                 this.setState({
                     totalMoney:0.00,
                     ratio:0,
                     pickUpMoney:0.00
                 })
             }
        }
    }
    //选择项目或活动id
    chooseItemId(event){
        event = event || window.event;
        let totalMoney = $(event.target).find('option:selected').attr('data-totalMoney');
        let ratio = $(event.target).find('option:selected').attr('data-ratio');
        let endTime = $(event.target).find('option:selected').attr('data-endTime');
        let target = $(event.target).find('option:selected').attr('data-target');
        let money = $(event.target).find('option:selected').attr('data-money');
        let id = event.target.value;
        if(target=='0.00'||endTime=='2038-01-10 00:00:00'){
            this.setState({
                id:id,
                isUnlimitedTarget:2,
                totalMoney:totalMoney,
                ratio:0
            })
        }else{
            this.setState({
                id:id,
                ratio:ratio,
                totalMoney:totalMoney,
                pickUpMoney:money,
                isUnlimitedTarget:1
            })
        }
    }
    //获取所有的项目活动
    getGroupAllChild(){
        let token = sessionStorage.getItem('token');
        let self = this;
        sendAjax({
            type:'POST',
            url:'admin/withdraw/findItemsInExecution',
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200){
                    if(data.projectList.length>0){
                        if(data.projectList[0].target=='0.00' || data.projectList[0].end_time=='2038-01-10 00:00:00'){
                            self.setState({
                                allProjects:data.projectList,
                                nowItems:data.projectList,
                                id:data.projectList[0].id,
                                isUnlimitedTarget:2,
                                totalMoney:data.projectList[0].total_money?data.projectList[0].total_money:0.00,
                                ratio:0
                            })
                        }else{
                            self.setState({
                                allProjects:data.projectList,
                                nowItems:data.projectList,
                                id:data.projectList[0].id,
                                ratio:data.projectList[0].ratio,
                                totalMoney:data.projectList[0].total_money?data.projectList[0].total_money:0.00,
                                pickUpMoney:data.projectList[0].money
                            })
                        }
                    }else{
                        self.setState({
                            totalMoney:0.00,
                            ratio:0,
                            pickUpMoney:0.00
                        })
                    }
                    if(data.activityList.length>0){
                        self.setState({
                            allActivitys:data.activityList
                        })
                    }
                    self.setState({
                        bankAccountInfo:data.bankAccountInfo
                    })
                }
            }
        })
    }
    //获取验证码
    getCode() {
        let token = sessionStorage.getItem('token');
        let mobile = this.refs.mobile.value;
        let self = this;
        if(!isOnlyMobile(mobile)){
            alert("手机号码不正确，请核对后再次点击发送！");
            return;
        }
        if(this.state.isCodeTime=='发送验证码'){
            sendAjax({
                type:"POST",
                url:"admin/withdraw/addWithdrawCode",
                data:{
                    token:token,
                    mobile:mobile
                },
                success:function(res) {
                    if(res.code==200) {

                        //alert('验证码已发送，请注意接收！')
                    }
                }
            })
            // 60秒时间读秒
            let timeNum = 60;
            let timer = setInterval(function() {
                timeNum--;
                if(timeNum<10&&timeNum>0) {
                    timeNum = "0"+timeNum;
                }
                self.setState({
                    isCodeTime:timeNum+'s'
                })
                if(timeNum <= 0){
                    clearInterval(timer);
                    self.setState({
                        isCodeTime:'发送验证码'
                    })
                }
            },1000)
        }
    }
}
