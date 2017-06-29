/**
 * Created by zn on 2017/6/9.
 */
import React from 'react';
import {sendAjax,getQueryString} from '../../../../../lib/commonEvent'

export default class UserInfo extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            userInfo:{}
        }
    }
    render(){
        return(<div id="userInfo">
            <div className="backBtn"  style={{marginLeft:'4%'}}>
               <a href={"#/user?typeId="+this.props.typeId}>用户管理列表</a>
                {/*<a href="javascript:history.back(-1)">用户管理列表</a>*/}
                <span className="noChange">></span>
                <span>用户详情</span>
            </div>
            <div className="userMessage">
                <div className="userBaseMessage">
                    <h3>基本信息：</h3>
                    <div>
                        <span className="modelL">用户昵称</span>
                        <span className="modelR">{this.state.userInfo.name}</span>
                    </div>
                    <div>
                        <span className="modelL">积分</span>
                        <span className="modelR">{this.state.userInfo.score}</span>
                    </div>
                    <div>
                        <span className="modelL">手机号</span>
                        <span className="modelR">{this.state.userInfo.mobile?this.state.userInfo.mobile:'-'}</span>
                    </div>
                    <div>
                        <span className="modelL">真实姓名</span>
                        <span className="modelR">{this.state.userInfo.realname?this.state.userInfo.realname:'-'}</span>
                    </div>
                    <div>
                        <span className="modelL">性别</span>
                        <span className="modelR">{this.state.userInfo.sex==0?'男':this.state.userInfo.sex==1?'女':'-'}</span>
                    </div>
                    <div>
                        <span className="modelL">邮箱</span>
                        <span className="modelR">{this.state.userInfo.mail?this.state.userInfo.mail:'-'}</span>
                    </div>
                </div>
                <div className="userBaseMessage">
                    <h3>爱心捐赠：</h3>
                    <div>
                        <span className="modelL">捐赠次数</span>
                        <span className="modelR">{this.state.userInfo.number}</span>
                    </div>
                    <div>
                        <span className="modelL">爱心捐赠</span>
                        <span className="modelR">{this.state.userInfo.total?this.state.userInfo.total:'0'}</span>
                    </div>
                    <div>
                        <span className="modelL">参与活动次数</span>
                        <span className="modelR">{this.state.userInfo.activityNumber}</span>
                    </div>
                </div>
                <div className="userBaseMessage">
                    <h3>一起捐：</h3>
                    <div>
                        <span className="modelL">发起的一起捐次数</span>
                        <span className="modelR">{this.state.userInfo.donate}</span>
                    </div>
                    <div>
                        <span className="modelL">一起捐筹款总额</span>
                        <span className="modelR">{this.state.userInfo.donateTotal?this.state.userInfo.donateTotal:'0'}</span>
                    </div>
                </div>
            </div>
        </div>)
    }
    componentDidMount(){
        this.getUserInformation();
    }
    getUserInformation(){
        let self = this;
        let obj = getQueryString();
        let token = sessionStorage.getItem('token');
        let id = obj.id;
        sendAjax({
            type:'POST',
            url:'admin/user/findUser',
            data:{
                token:token,
                userId:id
            },
            success:function(data){
                if(data.code==200){
                    self.setState({
                        userInfo:data.message
                    })
                }
            }
        })
    }
}
