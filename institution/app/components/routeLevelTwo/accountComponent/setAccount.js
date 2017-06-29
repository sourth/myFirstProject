import React from 'react';
import {sendAjax,getQueryString,isVal} from '../../../../lib/commonEvent';

const token = sessionStorage.getItem('token');
export default class AddRole extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            id:'',
            myLocation:'角色新增',
            isAddRole:'新增角色',
            isSave:'保存',
            allPowers:[]
        }
    }
    render(){
        return(<div id="addRole">
            <div className="backBtn"  style={{marginLeft:'4%',marginBottom:'50px'}}>
                <a href="#/account">账号管理列表</a>
                <span className="noChange">></span>
                <a href="#/account/addAccount">角色新增</a>
                <span className="noChange">></span>
                <a href="#/account/roleList">角色列表</a>
                <span className="noChange">></span>
                <span>{this.state.myLocation}</span>
            </div>
            <div className="addRoleBox">
                <div className="newRole">
                    <span>{this.state.isAddRole}</span>
                    <input type="text" ref="newRoleName"/>
                </div>
                <div className="allRoles">
                    {
                        this.state.allPowers.map(function(item,i){
                            return(
                                <label key={i}>
                                    <input name="roles" type='checkbox' value={item.id}/>
                                    {item.powername}
                                </label>
                            )
                        }.bind(this))
                    }
                </div>
            </div>
            <div className="saveMessage" onClick={this.sendMessage.bind(this)}>{this.state.isSave}</div>
        </div>)
    }
    componentDidMount(){
        this.getAllPowers();
    }
    sendMessage(){
        let baseUrl ='admin/account/addRole';
        if(this.state.id!=''){
            baseUrl = 'admin/account/editRole'
        }
        let roleName = this.refs.newRoleName.value;
        if(isVal(roleName)==''){
            alert('角色名称不能为空！');
            return;
        }
        let obj = document.getElementsByName("roles");
        let check_val = [];
        for(let k in obj){
            if(obj[k].checked)
                check_val.push(obj[k].value);
        }
        if(isVal(check_val)==''){
            alert('未选择角色权限!');
            return;
        }
        if(check_val.indexOf('1')==-1){
            if(check_val.indexOf('3')!=-1 || check_val.indexOf('2')!=-1 || check_val.indexOf('4')!=-1){
                alert('所选权限涉及项目/活动管理权限，请勾选!');
                return;
            }
        }
        let sendData ={
            token:token,
            name:roleName,
            power:check_val
        }
        if(this.state.id!=''){
            sendData.roleId = this.state.id;
        }
        sendAjax({
            type:'POST',
            url:baseUrl,
            data:sendData,
            success:function(data){
                if(data.code==200){
                    if(baseUrl=='admin/account/editRole'){
                        alert('修改成功！');
                    }else{
                        alert('添加成功！')
                    }
                    window.location.hash='#/account/roleList';
                }
            }
        })
    }
    //机构所有权限
    getAllPowers(){
        let self = this;
        sendAjax({
            type:'POST',
            url:'admin/account/findPowerList',
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200){
                    self.setState({
                        allPowers:data.message
                    })
                }
            },
            successThen(){
                let id = getQueryString().id;
                if(id){
                    self.setState({
                        id:id,
                        myLocation:'角色编辑',
                        isAddRole:'角色',
                        isSave:'修改'
                    },function(){
                        this.getRoleMessage();
                    })
                }
            }
        })
    }
    //角色权限
    getRoleMessage(){
        let self = this;
        let id = this.state.id;
        let obj = document.getElementsByName("roles");
        sendAjax({
            type:'POST',
            url:'admin/account/findRole',
            data:{
                token:token,
                roleId:id
            },
            success:function(data){
                if(data.code==200){
                    self.refs.newRoleName.value=data.message.rolename;
                    $.each(obj,function(index,item){
                        if(data.message.power.indexOf(Number(item.value))!=-1 || data.message.power.indexOf(item.value)!=-1){
                            $(item).attr('checked','checked');
                        }
                    })
                }
            }
        })
    }
}