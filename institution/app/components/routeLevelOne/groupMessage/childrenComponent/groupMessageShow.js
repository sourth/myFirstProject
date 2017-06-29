import React from 'react';
import {sendAjax,isVal} from '../../../../../lib/commonEvent';


export default class GroupMessageShow extends React.Component{
    constructor(){
        super();
        this.state = {
            star_level:0,
            groupMessage:"",
            groupPageFiles:[
                {
                    name:"",
                    link:"javascript:;"
                }
            ]
        }
    }
    render(){
        return (
            <div className="groupMessage" id="groupMessageShow">
                <div className="accountTitle">
                    <h2>机构基本信息</h2>
                    <span className="editor"  onClick={this.showGroupMessage.bind(this)}>编辑</span>
                </div>
                <div className="institutionMessage">
                    <div className="asset messageItem">
                        <span>机构名称</span>
                        <p>{this.state.groupMessage.name}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>机构评分</span>
                        <b className="institutionScore">{this.state.star_level}分</b>
                    </div>
                    <div className="asset messageItem">
                        <span>机构常用名</span>
                        <p className="institutionOftenName">{this.state.groupMessage.often_name}</p>
                    </div>
                    <div className="asset messageItem" style={{lineHeight:'28px'}}>
                        <span>成立时间</span>
                        <p>{this.state.groupMessage.start_time}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>所在地</span>
                        <p>{this.state.groupMessage.province} {this.state.groupMessage.city} {this.state.groupMessage.location}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>开户姓名</span>
                        <p>{this.state.groupMessage.account}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>银行卡号</span>
                        <p>{this.state.groupMessage.bank_number}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>负责人</span>
                        <p>{this.state.groupMessage.liable}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>开户银行</span>
                        <p>{this.state.groupMessage.bank_name}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>联系电话</span>
                        <p>{this.state.groupMessage.mobile}</p>
                    </div>
                    <div className="asset messageItem">
                        <span>email</span>
                        <p>{this.state.groupMessage.email}</p>
                    </div><div className="asset messageItem">
                        <span>官方网站</span>
                        <p>{this.state.groupMessage.website}</p>
                    </div>
                    {/*<div className="asset messageItem" style={{clear:"both",float:"none"}}>
                        <span>一句话简介</span>
                        <p>{this.state.groupMessage.content}</p>
                    </div>*/}
                    <div className="asset messageItem" style={{clear:"both",float:"none"}}>
                        <span>机构简介</span>
						<p>{this.state.groupMessage.content}</p>
                    </div>
                    <div className="asset messageItem" style={{clear:"both",float:"none"}}>
                        <span>机构证件</span>
                        <a href={this.state.groupMessage.card} className="groupCard underLine cursorPointer" target="_blank">
                            资格证
                        </a>
                    </div>
                    <div className="asset messageItem" style={{clear:"both",float:"none"}}>
                        <span>信息公开</span>
                        <div className="groupFileListShow left">
                            {
                                this.state.groupPageFiles.map(function(item,index){
                                    return (<p key={index}  style={{width:'150%'}} className="groupOpenMessage">
                                        <a href={item.link} download={item.name}>{item.name}</a>
                                    </p>)
                                }.bind(this))
                            }
                        </div>
                    </div>
                    <div className="messagePicture" style={{clear:"both",margin:"20px 0",overflow:"hidden"}}>
                        <div className="putInstitutionPicture left">
                            <div className="showPicture">
                                <img src={this.state.logo} alt=""/>
                                <p className="typeImg">机构LOGO</p>
                            </div>
                        </div>
                        <div className="putInstitutionPicture left">
                            <div className="showPicture">
                                <img src={this.state.backgroundImg} alt=""/>
                                <p className="typeImg">背景图</p>
                            </div>
                        </div>
                        <div className="putInstitutionPicture left">
                            <div className="showPicture">
                                <img src={this.state.showImg} alt=""/>
                                <p className="typeImg">展示图</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        this.getInformation();
    }
    getInformation(){
        let token = sessionStorage.getItem("token");
        let self = this;
        sendAjax({
            type:"POST",
            url:"admin/self/findInfo",
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200){
                    let message= data.message;
                    if(message.cover==""){
                        message.cover='./img/groupShow.png';
                    }
                    if(message.logo==""){
                        message.logo='./img/groupLogo.png';
                    }
                    if(message.background==""){
                        message.background='./img/groupBackImg.png';
                    }
                    self.setState({
                        star_level:message.star_level/2,
                        cover:message.card,
                        logo:message.logo,
                        backgroundImg:message.background,
                        showImg:message.cover,
                        groupMessage:message
                    })
                    if(data.message.userinfo){
                        self.setState({
                            groupPageFiles:data.message.userinfo
                        })
                    }
                }
            }
        })
    }
    showGroupMessage(){
        $("#groupMessageShow").hide();
        $("#groupMessageEditor").show();
    }
}
