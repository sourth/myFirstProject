import React from 'react';
import update from 'react-addons-update';
import {uploadImage} from '../../../../../../../lib/upload';
import {sendAjax,isVal,isMobile} from '../../../../../../../lib/commonEvent';

let token = sessionStorage.getItem("token");
export default class AddProjectProgress extends React.Component{
    constructor(){
        super();
        this.state = {

        };
    }
    render(){
        return (
            <div id="projectProgress" style={this.props.hideStyle}>
                <div className="backBtn">
                    <span onClick={this.backList.bind(this)}>募捐项目</span>
                    <span className="noChange">></span>
                    <span onClick={this.backProjectDetail.bind(this)}>项目详情</span>
                    <span className="noChange">></span>
                    <span>项目进展添加</span>
                </div>
                <div className="projectProgress">
                    <div className="progressMain">
                        <div className="progressTime">
                            <span className="timeTitle progressSpan">发布时间</span>
                            <input type="text" placeholder="如 2012-12-12 08:30:00" className="projectProgressTime" ref="projectProgressTime"/>
                        </div>
                        <div className="progressGroup">
                            <span className="groupTitle progressSpan">发布团队</span>
                            <input type="text" placeholder="团队名称" className="groupName" ref="groupName"/>
                        </div>
                        <div className="progressContent" >
                            <span className="progressSpan">内容</span>
                            <textarea  className="progressText" ref="progressContent">

                            </textarea>
                        </div>
                        <div className="progressPictures" >
                            <div id="addProgressImg" className="cursorPointer">点击添加图片</div>
                            <div id="progressImgContainer"></div>
                        </div>
                        <div className="saveMessage cursorPointer" onClick={this.getProjectProgressMessage.bind(this)}>
                            保存
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){
        //this.getInformation(nextProps.status);
    }
    componentDidMount(){
        let self = this;
        uploadImage("addProgressImg","progressImgContainer",this,2)
    }
    getProjectProgressMessage(){
        let self = this;
        let projectProgressMessage = {};
        projectProgressMessage.time = this.refs.projectProgressTime.value;
        if(this.refs.projectProgressTime.value==''){
            alert("发布时间不能为空！");
            return;
        }
        projectProgressMessage.team = this.refs["groupName"].value;
        if(this.refs["groupName"].value==""){
            alert("发布团队名称不能为空！");
            return;
        }
        projectProgressMessage.content = this.refs["progressContent"].value;
        if(this.refs["progressContent"].value==""){
            alert("内容不能为空！");
            return;
        }
        projectProgressMessage.picture = this.state.progressImg;
        if(this.state.progressImg==""){
            alert("您还没有上传图片！");
            return;
        }
        projectProgressMessage.token = token;
        projectProgressMessage.projectId = this.props.status;
        sendAjax({
            type:"POST",
            url:"admin/project/addProjectProgress",
            data:projectProgressMessage,
            success:function(data){
                if(data.code==200){
                    alert("添加成功！");
                    window.location.reload();
                    $(self.refs.groupName).val("");
                    $(self.refs.progressContent).val("");
                    this.refs.projectProgressTime.value = '';
                    sessionStorage.setItem("isEmptyProgressImg","yes");
                    $("#progressImgContainer").html("");
                    $("#projectInfo").show().siblings().hide();
                }else if(data.code==206&&data.message=='The time is not a valid date.'){
                    alert('发布时间格式不正确！');
                }else{
                    alert(data.message);
                }
            }
        })


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