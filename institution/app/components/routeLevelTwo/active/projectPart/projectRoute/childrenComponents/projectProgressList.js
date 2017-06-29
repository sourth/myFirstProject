import React from 'react';
import update from 'react-addons-update';
import {uploadImage} from '../../../../../../../lib/upload';
import {sendAjax,isVal,isMobile} from '../../../../../../../lib/commonEvent';
let token = sessionStorage.getItem("token");

export default class ProjectProgressList extends React.Component{
    constructor(){
        super();
        this.state = {
            projectProgress: [],
            isEmpty:{
                display:"block"
            }
        }
        ;
    }
    render(){
        return(<div id="projectProgressList" style={this.props.hideStyle}>
            <div className="backBtn">
                <span onClick={this.backList.bind(this)}>募捐项目</span>
                <span className="noChange">></span>
                <span onClick={this.backProjectDetail.bind(this)}>项目详情</span>
                <span className="noChange">></span>
                <span>项目进展列表</span>
            </div>
            <div className="emptyProgress" style={this.state.isEmpty}>
                您还没有添加过项目进展
            </div>
            <div className="addProjectProgress cursorPointer" onClick={this.addProjectProgress.bind(this)}>新增项目进展</div>
            <div className="projectProgressList">
                {
                    this.state.projectProgress.map(function(item,i){
                        return (<div className="progressList" key={i}>
                            <p className="startTime">{item.time}</p>
                            <p className="projectName">由<span style={{color:'red'}}>{item.team}</span>团队发布</p>
                            <p className="progressContent">{item.content}</p>
                            <div className="progressPictures">
                                {
                                    item.picture.map(function(data,index){
                                       return (
                                               <img src={data} key={index}/>
                                       )
                                    })
                                }
                            </div>
                        </div>)
                    })
                }
            </div>
        </div>)
    }
    componentWillReceiveProps(nextProps){
        this.getProjectProgress(nextProps.status);
    }
    //获取项目进展
    getProjectProgress(projectId){
        let self = this;
        sendAjax({
            type:"POST",
            url:"admin/project/findProgressList",
            data:{
                token:token,
                projectId:projectId
            },
            success:function(data){
               if(data.code==200){
                   self.setState({
                       projectProgress:data.message,
                       isEmpty:{
                           display:"none"
                       }
                   })
               }else if(data.code==204&&data.message=='NULL'){
                   self.setState({
                       projectProgress: [],
                       isEmpty:{
                           display:"block"
                       }
                   })
               }
            }
        })
    }
    addProjectProgress(){
        $('#projectProgress').css('display','block').siblings().css('display','none');
    }
    //返回列表页
    backList(){
        $("#projectList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#compile").addClass("hideItems");
        this.props.callbackParent(0);
    }
    //返回详情页
    backProjectDetail(){
        $("#projectInfo").show().siblings().hide();
        $("#compile").removeClass("hideItems");
    }
}
