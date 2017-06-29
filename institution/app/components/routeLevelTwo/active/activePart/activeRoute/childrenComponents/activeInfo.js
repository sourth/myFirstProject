import React from 'react';
import QRCode from 'qrcode.react';
import {sendAjax} from '../../../../../../../lib/commonEvent';
export default class ActiveInfo extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'information':{},
            //previewUrl:'http://www.fojiaosiyuan.com/activityDetail.html',
            previewUrl:'http://walq.lingshanfoundation.org/activityDetail.html',
            contactProjects:[]
        }
    }
    render(){
        return(
            <div id="activeInfo" style={this.props.hideStyle}>
                <div className="backBtn">
                    <span onClick={this.backList.bind(this)}>线下活动</span>
                    <span className="noChange">></span>
                    <span>活动详情</span>
                </div>
                <table className="projectRouteTable tableOne">
                    <tbody>
                    <tr>
                        <td>活动名称</td>
                        <td>{this.state.information.title}</td>
                    </tr>
                    <tr>
                        <td>活动总人数</td>
                        <td>{this.state.information.number}人</td>
                    </tr>
                    <tr>
                        <td>报名截止时间</td>
                        <td>{this.state.information.startTime}</td>
                    </tr>
                    <tr>
                        <td>报名费用</td>
                        <td>{this.state.information.charge}元</td>
                    </tr>
                    <tr>
                        <td>联系人</td>
                        <td>{this.state.information.contacts}</td>
                    </tr>
                    {/*<tr>
                        <td>提款百分比</td>
                        <td>{this.state.information.money_ratio}</td>
                    </tr>*/}
                    <tr>
                        <td>活动封面图</td>
                        <td>
                            <a style={{color:"#999",textDecoration:"underline"}} href={this.state.information.banner == ''?'javascript:void(0)':this.state.information.banner} target='_blank'>查看</a>
                        </td>
                    </tr>
                    <tr>
                        <td>活动列表展示图</td>
                        <td><a href={this.state.information.thumb?this.state.information.thumb:'javascript:;'} target="_blank" className="underLine">{this.state.information.thumb?'查看':'未上传'}</a></td>
                    </tr>
                    <tr>
                        <td>活动海报图</td>
                        <td>
                            <a href={this.state.information.poster?this.state.information.poster:'javascript:;'} target="_blank" className="underLine">{this.state.information.poster?'查看':'未上传'}</a>
                        </td>

                    </tr>
                    <tr>
                        <td>关联项目</td>
                        <td>
                            {
                                this.state.contactProjects.map(function(item,i){
                                    return(
                                        <span key={i} style={{marginRight:'10px'}}>{item.title}</span>
                                    )
                                })
                            }
                        </td>
                    </tr>
                    <tr>
                        <td>二维码</td>
                        <td>
                            <QRCode value={this.state.previewUrl} />
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table className="projectRouteTable tableTwo">
                    <tbody>
                    <tr>
                        <td>活动状态</td>
                        <td>{this.state.information.activityState}</td>
                    </tr>
                    <tr>
                        <td>已报名人数</td>
                        <td>{this.state.information.num}人</td>
                    </tr>
                    <tr>
                        <td>活动举行时间</td>
                        <td>{this.state.information.endTime}</td>
                    </tr>
                    <tr>
                        <td>活动举办地址</td>
                        <td>{this.state.information.province} {this.state.information.city} {this.state.information.location}</td>
                    </tr>
                    <tr>
                        <td>联系电话</td>
                        <td>{this.state.information.mobile}</td>
                    </tr>
                    <tr>
                        <td>爱心互动</td>
                        <td>暂无</td>
                    </tr>
                    <tr>
                        <td>报名表</td>
                        <td >
                            <span className="underLine cursorPointer" onClick={this.showEnrollList.bind(this)}>线上报名列表</span>
                            <span className="underLine cursorPointer offLineEnroll" onClick={this.showOffLineEnrollList.bind(this)}>线下报名表</span>
                        </td>
                    </tr>
                    <tr>
                        <td>活动简介</td>
                        <td>{this.state.information.description}</td>
                    </tr>
                    </tbody>
                </table>
                <div className="activeIntroduceContainer">
                    <div className="activeIntro">活动介绍</div>
                    <div id="activityContentDetails"></div>
                </div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){
        this.getInformation(nextProps.status)
    }
    backList(){
        $("#activeList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#compile").addClass("hideItems");
        $("#exportEnroll,#putInEnroll").addClass("hideItems");
        this.props.callbackParent(0);
        this.props.isIndex(1);
    }
    showEnrollList(){
        $("#enrollList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#putInEnroll").addClass('hideItems');
        $("#increase").addClass("hideItems");
        $("#compile").addClass("hideItems");
    }
    showOffLineEnrollList(){
        $("#offLineEnrollList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#exportEnroll").addClass('hideItems');
        $("#increase").addClass("hideItems");
        $("#compile").addClass("hideItems");
    }
    getInformation(id){
        let token = sessionStorage.getItem('token');
        let that = this;
        sendAjax({
            type:'POST',
            url:"admin/activity/findActivity",
            data:{
                token:token,
                id:id
            },
            success:function(data){
                if(data.code == 200){
                    let nowDate = new Date();
                    let nowDateMs = new Date(nowDate).getTime();
                    let startTime =data.activity.start_time;
                    data.activity.startTime = startTime;
                    let startTimeMs = new Date(data.activity.start_time.replace(/-/g, "/")).getTime()
                    let endTime = data.activity.end_time;
                    data.activity.endTime = endTime;
                    let endTimeMs = new Date(data.activity.end_time.replace(/-/g, "/")).getTime();
                    let status = data.activity.status;
                    if(status==0){
                        data.activity.activityState="待审核";
                    }else if(status==2){
                        data.activity.activityState="未通过";
                    }else if(status==1){
                        if(startTimeMs>nowDateMs){
                            data.activity.activityState="报名中";
                        }else if(startTimeMs<=nowDateMs&&nowDateMs<=endTimeMs){
                            data.activity.activityState="进行中";
                        }else if(nowDateMs>endTimeMs){
                            data.activity.activityState="活动结束";
                        }
                    }
                    that.setState({
                        'information':data.activity,
                        contactProjects:data.activity.project,
                        //previewUrl:'http://www.fojiaosiyuan.com/activityDetail.html?activityId='+data.activity.id+'&group_id='+data.activity.group_id+'&status='+data.activity.status
                        previewUrl:'http://walq.lingshanfoundation.org/activityDetail.html?activityId='+data.activity.id+'&group_id='+data.activity.group_id+'&state='+data.status
                    },function(){
                        document.getElementById('activityContentDetails').innerHTML = that.state.information.content
                    })
                }
            }
        })
    }
}