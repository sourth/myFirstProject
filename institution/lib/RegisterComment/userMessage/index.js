import React from 'react';
import {isPassword,isVal,isUserName,sendAjax} from '../../commonEvent';
import update from 'react-addons-update';

const token = sessionStorage.getItem("notPostToken");
export default class UserMessage extends React.Component{
    constructor(){
        super()
        this.state = {
            groupMessage:{},
            userMessage:{
                name:'',
                liable:'',
                password:'',
                username:''
            }
        }
    }
    render(){
        return(
            <div className="registerClassify">
                <div className="registerUser">
                    <span className="left institutionName">机构名称</span>
                    <input type="text" className="left institutionNameI" ref="name" placeholder="请输入机构名称" value={this.state.userMessage.name} onChange={this.postGroupName.bind(this)}/>
                </div>
                <div className="registerUser">
                    <span className="left username">主要联系人</span>
                    <input type="text" className="left usernameI" ref="liable" placeholder="请输入主要联系人" value={this.state.userMessage.liable} onChange={this.postGroupLiable.bind(this)}/>
                </div>
                <div className="registerUser" ref="myAccount">
                    <span className="left accountNumber">账号</span>
                    <input type="text" className="left accountNumberI" ref="userName" placeholder="请输入账号（机构拼音首字母）" value={this.state.userMessage.username} onChange={this.postGroupUserName.bind(this)}/>
                </div>
                <div className="registerUser " ref="myPassword">
                    <span className="left password">密码</span>
                    <input type="password" className="left passwordI" ref="password" placeholder="请输入密码" value={this.state.userMessage.password} onChange={this.postGroupPassword.bind(this)}/>
                </div>
                <div className="save saveUserMessage cursorPointer" onClick={this.nextStep.bind(this)}>
                    下一步
                </div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        if(sessionStorage.getItem("userMessage")&&isVal(token)==""){
            this.setState({
                userMessage:JSON.parse(sessionStorage.getItem("userMessage"))
            })
        }
        if(isVal(token)!=""){
            $(this.refs.myAccount).hide();
            $(this.refs.myPassword).hide();
            sendAjax({
                type:"POST",
                url:"groupInfo/findGroupInfo",
                data:{
                    token:token
                },
                success:function(data){
                    if(data.code==200){
                        self.setState({
                            userMessage:{
                                name:data.message.groupName,
                                liable:data.message.liable,
                                password:'',
                                username:''
                            }
                        })
                        sessionStorage.setItem("groupMessage",JSON.stringify(data.message))
                    }
                }
            })
        }
        document.onkeydown = function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode==13){
                self.nextStep()
            }
        }
    }
    nextStep(){
        let userMessage = {}
        let name = $(".institutionNameI").val();
        if(isVal(name)==""){
            alert("机构名称不能为空！");
            return false;
        }else if(name.length>20){
            alert('机构名称限制20字以内！');
            return;
        }

        userMessage.name = name;
        let liable = $(".usernameI").val();
        if(isVal(liable)==""){
            alert("负责人不能为空");
            return false;
        }else if(liable.length<2||liable.length>10){
            alert("负责人限制2-10个字符！");
            //$(".usernameI").val("")
            return false;
        }
        userMessage.liable = liable;
        let username = $(".accountNumberI").val();
        if(isVal(token)==""){
            if(isVal(username)==""){
                alert("账号不能为空！");
                return false;
            }else if(!isUserName(username)){
                alert("账号由5-15个数字或字母组成！");
                return false;
            }
            userMessage.username = username;
            let password = $(".passwordI").val();
            if(isVal(password)==""){
                alert("密码不能为空！");
                return false;
            }else if(!isPassword(password)){
                alert("密码由6-16个数字或字母组成！");
                return false;
            }
            userMessage.password = password;
        }
        sessionStorage.setItem("userMessage",JSON.stringify(userMessage))
        window.location.href="#/institutionMessage";
    }
    postGroupName(){
        let newData = update(this.state.userMessage,{'name':{$set:this.refs.name.value}});
        this.setState({
            'userMessage':newData
        })
    }
    postGroupLiable(){
        let newData = update(this.state.userMessage,{'liable':{$set:this.refs.liable.value}});
        this.setState({
            'userMessage':newData
        })
    }
    postGroupUserName(){
        let newData = update(this.state.userMessage,{'username':{$set:this.refs.userName.value}});
        this.setState({
            'userMessage':newData
        })
    }
    postGroupPassword(){
        let newData = update(this.state.userMessage,{'password':{$set:this.refs.password.value}});
        this.setState({
            'userMessage':newData
        })
    }
}
