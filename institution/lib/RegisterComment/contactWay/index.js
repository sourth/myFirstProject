import React from 'react';
import {isMobile,isEmail,isVal,sendAjax} from '../../commonEvent';
import update from 'react-addons-update';

export default class contactMessage extends React.Component{
    constructor(){
        super()
        this.state = {
            checked:true,
            groupMessage:{},
            contactMessage:{
                account:'',
                bankNumber:'',
                bankName:'',
                mobile:'',
                email:''
            }
        }
    }
    render(){
        return(
            <div className="registerClassify">
                <div className="registerUser">
                    <span className="left accountName">开户姓名</span>
                    <input type="text" className="left accountNameI" ref="account" placeholder="请输入开户姓名" value={this.state.contactMessage.account} onChange={this.postGroupAccount.bind(this)} />
                </div>
                <div className="registerUser">
                    <span className="left accountBank" >机构银行账号</span>
                    <input type="text" className="left accountBankI" placeholder="请输入银行卡号" ref="bankNumber" value={this.state.contactMessage.bankNumber} onChange={this.postGroupBankNumber.bind(this)} />
                </div>
                <div className="registerUser">
                    <span className="left institutionBank">开户支行</span>
                    <input type="text" className="left institutionBankI" placeholder="请输入开户支行" ref="bankName" value={this.state.contactMessage.bankName} onChange={this.postGroupBankName.bind(this)} />
                </div>
                <div className="registerUser">
                    <span className="left contactPhoneNumber">负责人联系电话</span>
                    <input type="tel" className="left contactPhoneNumberI" placeholder="请输入电话号码" ref="mobile" value={this.state.contactMessage.mobile} onChange={this.postGroupMobile.bind(this)} />
                </div>
                <div className="registerUser">
                    <span className="left institutionEmail">机构邮箱</span>
                    <input type="text" className="left institutionEmailI" placeholder="请输入机构邮箱" ref="email" value={this.state.contactMessage.email} onChange={this.postGroupEmail.bind(this)} />
                </div>
                <div className="save saveUserMessage cursorPointer" style={{marginBottom:"0px"}} onClick={this.submitAudit.bind(this)}>
                    提交审核
                </div>
                <div className="agreement">
                    <input type="checkbox" className="isAgree" checked={this.state.checked} onChange={this.isAgree.bind(this)}/>阅读并同意
                    <a href="../../../../../agree.html" target="_blank">《为爱联劝注册协议》</a>
                    <a href="../../../../../agreement/IntellectualPropertyStatement.html" target="_blank">《隐私政策》</a>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        let groupMessage=JSON.parse(sessionStorage.getItem("groupMessage"))
        if(isVal(groupMessage)!=''){
            this.setState({
                groupMessage:groupMessage
            })
        }
        if(isVal(groupMessage)!=""){
            this.setState({
                contactMessage:{
                    account:groupMessage.account,
                    bankNumber:groupMessage.bankNumber,
                    bankName:groupMessage.bankName,
                    mobile:groupMessage.mobile,
                    email:groupMessage.email
                }
            })
        }
        if(sessionStorage.getItem("contactMessage")&&isVal(groupMessage)==""){
            this.setState({
                contactMessage:JSON.parse(sessionStorage.getItem("contactMessage"))
            })
        }
        document.onkeydown = function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode==13){
                self.submitAudit()
            }
        }
    }
    isAgree(){
        this.setState({
            checked:!this.state.checked
        })

    }
    submitAudit(){
        let self = this;
        if(this.state.checked==false){
            alert("请先同意《为爱联劝注册协议》和《隐私政策》");
            return false;
        }
        let contactMessage = {};
        let account = $(".accountNameI").val();
        if(isVal(account)==""){
            alert("开户姓名不能为空！");
            return false;
        }else if(account.length<2||account.length>20){
            alert("开户姓名限制2-20字内！");
            return false;
        }
        contactMessage.account = account;
        let bankNumber = $(".accountBankI").val();
        if(isVal(bankNumber)==""){
            alert("开户账号不能为空！");
            return false;
        }else if(bankNumber.length<2||bankNumber.length>30){
            alert("开户账号限制2-30字内！");
            return false;
        }
        contactMessage.bankNumber = bankNumber;
        let bankName = $(".institutionBankI").val();
        if(isVal(bankName)==""){
            alert("开户支行不能为空！");
            return false;
        }else if(bankName.length<2||bankName.length>20){
            alert("开户支行2-20字内！");
            return false;
        }
        contactMessage.bankName = bankName;
        let mobile = $(".contactPhoneNumberI").val();
        if(isVal(mobile)==""){
            alert("负责人联系电话不能为空！");
            return false;
        }else if(!isMobile(mobile)){
            alert("手机号不符合规则！");
            return false;
        }
        contactMessage.mobile = mobile;
        let email = $(".institutionEmailI").val();
        if(isVal(email)==""){
            alert("机构邮箱不能为空");
            return false;
        }else if(!isEmail(email)){
            alert("机构邮箱号不符合规则！");
            return false;
        }
        contactMessage.email = email;
        sessionStorage.setItem("contactMessage",JSON.stringify(contactMessage))
        let totalMessage = {};
        let userMessage = JSON.parse(sessionStorage.getItem("userMessage"));
        let institutionMessage = JSON.parse(sessionStorage.getItem("institutionMessage"));
        for(let key in userMessage){
            totalMessage[key] = userMessage[key];
        }
        for(let key in institutionMessage){
            totalMessage[key] = institutionMessage[key];
        }
        for(let key in contactMessage){
            totalMessage[key] = contactMessage[key];
        }
        let url = '';
        if(this.state.groupMessage.groupName){
           url = 'groupInfo/editGroupInfo';
            totalMessage.token = sessionStorage.getItem('notPostToken');
            totalMessage.groupName = totalMessage.name;

        }else{
            url = "adminLogin/register";
        }
        sendAjax({
            type:"POST",
            url:url,
            data:totalMessage,
            success:function(data){


                if(data.code==200){
                    window.location.href="#/submitAudit";
                    if(self.state.groupMessage.groupName){
                        sessionStorage.removeItem('notPostToken');
                        sessionStorage.removeItem('groupMessage');
                    }
                }else if(data.code==206&&data.message=="The username has already been taken."){
                    alert("账号重复，请重新输入。");
                    window.location.hash='#/userMessage';
                }else if(data.code==206&&data.message=='The start time is not a valid date.'){
                    alert('成立时间格式不正确，请重新输入(正确格式如:2012-12-12)');
                    window.location.hash='#/institutionMessage'
                }else{
                    alert(data.message);
                }
            }
        })
    }
    postGroupAccount(){
        let newData = update(this.state.contactMessage,{'account':{$set:this.refs.account.value}});
        this.setState({
            'contactMessage':newData
        })
    }
    postGroupBankName(){
        let newData = update(this.state.contactMessage,{'bankName':{$set:this.refs.bankName.value}});
        this.setState({
            'contactMessage':newData
        })
    }
    postGroupBankNumber(){
        let newData = update(this.state.contactMessage,{'bankNumber':{$set:this.refs.bankNumber.value}});
        this.setState({
            'contactMessage':newData
        })
    }
    postGroupMobile(){
        let newData = update(this.state.contactMessage,{'mobile':{$set:this.refs.mobile.value}});
        this.setState({
            'contactMessage':newData
        })
    }
    postGroupEmail(){
        let newData = update(this.state.contactMessage,{'email':{$set:this.refs.email.value}});
        this.setState({
            'contactMessage':newData
        })
    }
}



