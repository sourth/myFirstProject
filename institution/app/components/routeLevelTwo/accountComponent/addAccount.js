import React from 'react';
import {sendAjax,getQueryString,isVal,isPassword,isUserName} from '../../../../lib/commonEvent';

export default class AddAccount extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id:'',
            myLocation:'账号新增',
            allRoles:[],
            role:'',
            isAdd:'确认添加',
            flag:true,
            type:'password'
        }
    }
    render(){
        return(<div id="addAccount">
            <div className="backBtn"  style={{marginLeft:'4%',marginBottom:'50px'}}>
                <a href="#/account">账号管理列表</a>
                <span className="noChange">></span>
                <span>{this.state.myLocation}</span>
            </div>
            <div className="accountBox">
                <span>真实姓名</span>
                <input type="text" placeholder="请输入真实姓名" ref="realName"/>
            </div>
            <div className="accountBox">
                <span>用户名</span>
                <input type="text" placeholder="请输入用户名" ref="userName"/>
            </div>
            <div className="accountBox" style={{position:'relative'}}>
                <span>密码</span>
                <input type='password' placeholder="由6-13位数字或字母组成" ref="password"/>
            </div>
            <div className="accountBox">
                <span>角色</span>
                <select name="" id="groupAllRoles" onChange={this.chooseRoles.bind(this)}>
                    {
                        this.state.allRoles.map(function(item,i){
                            return(<option value={item.id} key={i}>{item.rolename}</option>)
                        })
                    }
                </select>
                <a href="#/account/roleList" className="setRole">角色管理</a>
            </div>
            <div className="saveMessage" onClick={this.sendMessage.bind(this)}>{this.state.isAdd}</div>
        </div>)
    }
    componentDidMount(){
        this.getAllRoles();
        let id = getQueryString().id;
        if(id){
            this.setState({
                id:id,
                myLocation:'账号编辑',
                isAdd:'修改'
            },function(){
                this. getAccountMessage();
            })
        }
    }
    //获取编辑信息
    getAccountMessage(){
        let token = sessionStorage.getItem('token');
        let self = this;
        let id = this.state.id;
        sendAjax({
            type:'POST',
            url:'admin/account/findAdmin',
            data:{
                token:token,
                adminId:id
            },
            success:function(data){
                if(data.code==200){
                    self.refs.realName.value = data.message.realname;
                    self.refs.userName.value = data.message.name;
                    self.refs.password.value = '******';
                    $('#groupAllRoles').val(data.message.roleId);
                    self.setState({
                        originRoleId:data.message.roleId
                    })
                }
            }
        })
    }
    //获取所有角色
    getAllRoles(){
        let token = sessionStorage.getItem('token');
        let self = this;
        sendAjax({
            type:'POST',
            url:'admin/account/findRoleAdminList',
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200){
                    if(data.message.length>0){
                        self.setState({
                            allRoles:data.message,
                            role:data.message[0].id
                        })
                    }
                }
            },
            successThen(){
                if(self.state.originRoleId){
                    $('#groupAllRoles').val(self.state.originRoleId);
                }
            }
        })
    }
    //发送请求
    sendMessage(){
        let token = sessionStorage.getItem('token');
        let url = 'admin/account/addAdmin';
        let sendData = {};
        sendData.name = this.refs.userName.value;
        if(isVal(this.refs.userName.value)==''){
            alert('用户名不能为空');
            return;
        }else if(!isUserName(this.refs.userName.value)){
            alert('用户名由5-15位数字和字母组成！');
            return;
        }
        sendData.realname = this.refs.realName.value;
        if(isVal(this.refs.realName.value)==''){
            alert('真实姓名不能为空！');
            return;
        }
        if(this.state.id!=''){
            url = 'admin/account/editAdmin';
            if(this.refs.password.value=='******'){
                sendData.password = '';
            }else if(!isPassword(this.refs.password.value)){
                alert('密码不符合规则，请重新输入，密码由6-13位数字或字母组成！');
                return;
            }else{
                sendData.password = this.refs.password.value;
            }
            sendData.adminId = this.state.id;
        }else{
            sendData.password = this.refs.password.value;
            if(isVal(this.refs.password.value)==''){
                alert('密码不能为空！');
                return;
            }else if(!isPassword(this.refs.password.value)){
                alert('密码不符合规则，请重新输入，密码由6-13位数字或字母组成！');
                return;
            }
        }
        if(this.state.role==''){
            alert('请选择角色，若无角色，请先进行角色管理，新增角色！');
            return;
        }
        sendData.role = this.state.role;
        sendData.token = token;
        sendAjax({
            type:'POST',
            url:url,
            data:sendData,
            success:function(data){
                if(data.code==200){
                    alert('添加成功！');
                    window.location.hash='#/account';
                }else if(data.code==206&&data.message=='The name has already been taken.'){
                    alert('用户名重复，请重新填写！');
                }else{
                    alert(data.message);
                }
            }
        })
    }
    //选择角色
    chooseRoles(event){
        event = event || window.event;
        let role = event.target.value;
        this.setState({
            role:role
        })
    }
}