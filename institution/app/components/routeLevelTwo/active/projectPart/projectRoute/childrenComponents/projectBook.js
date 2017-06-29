import React from 'react';
import './projectBook.less';
import update from 'react-addons-update';
import {sendAjax,isVal} from '../../../../../../../lib/commonEvent';
import {uploadImage} from '../../../../../../../lib/upload';
let token = sessionStorage.getItem('token');
export default class ProjectBook extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            projectBookItems:{},
            isEdit:true,
            isShowCompile:{
                display:"none"
            },
            witchBook:"项目详情"
        };
    }
    render(){
        return(
            <div id="projectBook" style={this.props.hideStyle} className="projectBook">
                <div className="backBtn">
                    <span onClick={this.backList.bind(this)}>募捐项目</span>
                    <span className="noChange">></span>
                    <span onClick={this.backProjectDetail.bind(this)} >{this.state.witchBook}</span>
                    <span className="noChange">></span>
                    <span onClick={this.backProjectCompile.bind(this)} style={this.state.isShowCompile}>项目编辑></span>
                    <span>项目书</span>
                </div>
                <div className="bookMain">
                    <div className="projectName divInline">
                        <span className="bookSpan">
                            项目名称
                        </span>
                        <input type="text" className="bookInput" ref="projectName" value={this.state.projectBookItems.projectName} onChange={this.postName.bind(this)}/>
                    </div>
                    <div className="projectServerArea divInline">
                        <span className="bookSpan">
                            项目服务领域
                        </span>
                        <input type="text" className="bookInput" ref="projectServerArea" value={this.state.projectBookItems.projectServerArea} onChange = {this.postServerArea.bind(this)}/>
                    </div>
                    <div className="startTime divInline">
                        <span className="bookSpan">
                            项目开始时间
                        </span>
                        <input type="text" value={this.state.projectBookItems.projectStartTime} onChange={this.postProjectStartTime.bind(this)} ref="projectStartTime" className="bookInput" placeholder="如 0000-00-00"/>
                    </div>
                    <div className="endTime divInline">
                        <span className="bookSpan">
                           项目结束时间
                        </span>
                        <input type="text" value={this.state.projectBookItems.projectEndTime} onChange={this.postProjectEndTime.bind(this)} ref="projectEndTime" className="bookInput" placeholder="如 0000-00-00"/>
                    </div>
                    <div className="projectInPlace divInline">
                        <span className="bookSpan">
                            项目实施地
                        </span>
                        <input type="text" className="bookInput" ref="projectInPlace" value={this.state.projectBookItems.projectInPlace} onChange = {this.postInPlace.bind(this)}/>
                    </div>
                    <div className="bookBudget divInline">
                        <span className="bookSpan">
                            项目预算（元）
                        </span>
                        <input type="number" className="bookInput" ref="bookBudget" value={this.state.projectBookItems.bookBudget} onChange = {this.postBudget.bind(this)}/>
                    </div>
                    <div className="beneficiaryNumber divInline">
                        <span className="bookSpan">
                            受益人数
                        </span>
                        <input type="number" className="bookInput" ref="beneficiaryNumber" value={this.state.projectBookItems.beneficiaryNumber} onChange = {this.postNumber.bind(this)}/>
                    </div>
                    <div className="bookPrincipal divInline">
                        <span className="bookSpan">
                            项目负责人
                        </span>
                        <input type="text" className="bookInput" ref="bookPrincipal" value={this.state.projectBookItems.bookPrincipal} onChange = {this.postPrincipal.bind(this)}/>
                    </div>
                    <div className="bookDuty divInline">
                        <span className="bookSpan">
                            职务
                        </span>
                        <input type="text" className="bookInput" ref="bookDuty" value={this.state.projectBookItems.bookDuty} onChange = {this.postDuty.bind(this)}/>
                    </div>
                    <div className="bookEmail divInline">
                        <span className="bookSpan">
                            电子邮件
                        </span>
                        <input type="text" className="bookInput" ref="bookEmail" value={this.state.projectBookItems.bookEmail} onChange = {this.postEmail.bind(this)}/>
                    </div>
                    <div className="bookPhone divInline">
                        <span className="bookSpan">
                            手机
                        </span>
                        <input type="number" className="bookInput" ref="bookPhone" value={this.state.projectBookItems.bookPhone} onChange = {this.postPhone.bind(this)}/>
                    </div>
                    <div className="projectBgdAndBen">
                        <h2 className="bookTitles">
                            项目背景及受益群体需求分析
                        </h2>
                        <textarea className="bookTextArea projectBgdArea" ref="projectBgdArea" placeholder="简要介绍本项目的背景信息；&#13;&#10;将要受益的人群目前所面临的压力/困境/困难；&#13;&#10;针对这些压力/困境/困难，分析将要受益的人群的需求。" value={this.state.projectBookItems.projectBgdArea} onChange = {this.postBgdArea.bind(this)}>
                        </textarea>
                    </div>
                    <div className="projectTarget">
                        <h2 className="bookTitles">
                            项目目标（预期成果）
                        </h2>
                        <textarea className="bookTextArea projectTargetArea" ref="projectTargetArea" value={this.state.projectBookItems.projectTargetArea} onChange = {this.postTargetArea.bind(this)} placeholder="项目执行需要达到什么样的目标？&#13;&#10;可以列出主目标和分目标。">
                        </textarea>
                    </div>
                    <div className="projectServicePlan">
                        <h2 className="bookTitles">
                            项目服务计划
                        </h2>
                        <textarea className="bookTextArea servicePlanArea" ref="servicePlanArea" placeholder="1、整个项目的起止日期；&#13;&#10;2、每个项目活动完成的起止日期；&#13;&#10;3、服务计划一定要有明确的时间轴；&#13;&#10;4、此部分内容是整个项目书全文的主体和精华，请用简介明了的语句，搭好项目的逻辑框架，再细化各个项目活动；&#13;&#10;5、此部分的内容须和上线的“为爱行走”文案的项目执行计划完全一致。" value={this.state.projectBookItems.servicePlanArea} onChange = {this.postPlanArea.bind(this)}>
                        </textarea>
                    </div>
                    <div className="projectAssessmentResult">
                        <h2 className="bookTitles">
                            评估结果
                        </h2>
                        <textarea className="bookTextArea assessmentResultArea" ref="assessmentResultArea" placeholder="1、用于衡量项目执行过程中，是否能够完成/达到最初的项目目标；&#13;&#10;2、以及项目活动执行的质量是否达标。&#13;&#10;*Tips：评估指标的设置，可以参考SMART原则：具体的（Specific）；可以衡量的（Measurable）；可以达到的（Attainable）；与其他目标具有一定的相关性（Relevant）；有明确的截止期限（Time-bound）。具体的解释可以参考百度百科。" value={this.state.projectBookItems.assessmentResultArea} onChange = {this.postAssessmentResult.bind(this)}>
                        </textarea>
                    </div>
                    <div className="projectBudgetDetailTitle">
                        <h2 className="bookTitles">
                          项目预算
                        </h2>
                        <div className="coverBanner">
                            <div id="projectBookBudget">
                                <img src={this.state.projectBookItems.projectBookBudget}/>
                            </div>
                            <div id="progressLine1"></div>
                        </div>
                    </div>
                    <div className="saveMessage" onClick={this.getProjectBookItems.bind(this)}>确定</div>
                </div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){
        this.getInformation(nextProps.status,nextProps.projectBookStatus)
    }
    componentDidMount(){
        uploadImage('projectBookBudget','progressLine1',this)
    }
    getProjectBookItems(){
        let projectBookItems = this.state.projectBookItems;
        if(this.refs.projectName.value == ''){
            alert('请输入项目名称');
            return
        }else if(this.refs.projectName.value.length > 20){
            alert('项目名称不能超过20字');
            return
        }
        projectBookItems.projectName = this.refs["projectName"].value;
        if(this.refs.projectServerArea.value == ''){
            alert('请输入项目服务领域，用逗号或者空格隔开');
            return
        }else if(this.refs.projectServerArea.value.length > 20){
            alert('项目服务领域不能超过20字');
            return
        }
        projectBookItems.projectServerArea = this.refs["projectServerArea"].value;
        if(isVal(this.refs["projectStartTime"].value)==''){
            alert('项目开始时间未填写');
            return;
        }
        if(isVal(this.refs["projectEndTime"].value)==''){
            alert('项目结束时间未填写');
            return;
        }
        projectBookItems.projectStartTime = this.refs["projectStartTime"].value;
        projectBookItems.projectEndTime = this.refs["projectEndTime"].value;
        if(this.refs.projectInPlace.value == ''){
            alert('请输入项目实施地');
            return
        }else if(this.refs.projectInPlace.value.length > 30){
            alert('项目实施地不能超过30字')
            return
        }
        projectBookItems.projectInPlace = this.refs["projectInPlace"].value;
        if(this.refs.bookBudget.value == ''){
            alert('请输入项目预算')
            return
        }else if(this.refs.bookBudget.value < 0){
            alert('项目预算输入错误');
            return
        }
        projectBookItems.bookBudget = this.refs["bookBudget"].value;
        if(this.refs.beneficiaryNumber.value == ''){
            alert('请输入受益人数')
            return
        }else if(this.refs.beneficiaryNumber.value < 1){
            alert('受益人数输入错误');
            return
        }
        projectBookItems.beneficiaryNumber = this.refs["beneficiaryNumber"].value;
        if(this.refs.bookPrincipal.value == ''){
            alert('请输入项目负责人');
            return
        }
        projectBookItems.bookPrincipal = this.refs["bookPrincipal"].value;
        if(this.refs.bookDuty.value == ''){
            alert('请输入职务');
            return
        }
        projectBookItems.bookDuty = this.refs["bookDuty"].value;
        var emailTest = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/
        if(!emailTest.test(this.refs.bookEmail.value)){
            alert('请输入正确的邮箱');
            return
        }
        projectBookItems.bookEmail = this.refs["bookEmail"].value;
        if(this.refs.bookPhone.value == ''){
            alert('请输入手机号');
            return
        }
        projectBookItems.bookPhone = this.refs["bookPhone"].value;
        if(this.refs.projectBgdArea.value == ''){
            alert('请输入项目背景及受益群体需求分析');
            return
        }else if(this.refs.projectBgdArea.value.length < 50){
            alert('项目背景及受益群体分析内容不能少于50字');
            return
        }
        projectBookItems.projectBgdArea = this.refs["projectBgdArea"].value;
        if(this.refs.projectTargetArea.value == ''){
            alert('请输入项目目标');
            return
        }else if(this.refs.projectTargetArea.value.length < 50){
            alert('项目目标内容不能少于50字');
            return
        }
        projectBookItems.projectTargetArea = this.refs["projectTargetArea"].value;
        if(this.refs.servicePlanArea.value == ''){
            alert('请输入项目服务计划');
            return
        }else if(this.refs.servicePlanArea.value.length < 50){
            alert('项目服务计划内容不能少于50字');
            return
        }
        projectBookItems.servicePlanArea = this.refs["servicePlanArea"].value;
        if(this.refs.assessmentResultArea.value == ''){
            alert('请输入评估结果');
            return
        }else if(this.refs.assessmentResultArea.value.length < 50){
            alert('评估结果内容不能少于50字');
            return
        }
        projectBookItems.assessmentResultArea = this.refs["assessmentResultArea"].value;
        let projectBookBudget = ''
        if(isVal(this.state.projectBookBudget)!=''){
            projectBookBudget = this.state.projectBookBudget;
        }
        projectBookItems.projectBookBudget = projectBookBudget;
        this.setState({
            projectBookItems:projectBookItems
        },function(){
            if(this.props.projectBookStatus == 'info'){
                $('#projectInfo').css('display','block').siblings().css('display','none');
            }else if(this.props.projectBookStatus == 'compile'){
                $('#projectCompile').css('display','block').siblings().css('display','none');
            }else{
                $('#projectAdd').css('display','block').siblings().css('display','none');
            }
            this.props.projectBookBack(this.state.projectBookItems);
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
         if(this.props.projectBookStatus=="empty"){
             $("#projectAdd").show().siblings().hide();
         }else{
             $("#projectInfo").show().siblings().hide();
             $("#compile").removeClass("hideItems")
         }
    }
    //返回编辑页
    backProjectCompile(){
        $("#projectCompile").show().siblings().hide();
    }
    getInformation(projectId,status){
        let that = this;
        if(status=="empty"){
            $('#projectBook input').removeAttr('readonly');
            $('#projectBook textarea').removeAttr('readonly');
            let projectBookItems = {};
            if(isVal(this.state.projectBookItems)!=''){
                for(let key in this.state.projectBookItems){
                    projectBookItems[key]=''
                }
            }
            that.setState({
                witchBook:"项目添加",
                isShowCompile:{
                    display:"none"
                },
                'projectBookItems':projectBookItems
            })
            return;
        }
        sendAjax({
            type:"POST",
            url:"admin/project/findProject",
            data:{
                'token':token,
                'projectId':projectId
            },
            success:function(data){
                if(data.code == 200){
                    if(data.message.projectBook==null || data.message.projectBook==''){
                        let projectBookItems = {};
                        if(isVal(that.state.projectBookItems)!=''){
                            for(let key in that.state.projectBookItems){
                                projectBookItems[key]=''
                            }
                        }
                        data.message.projectBook = projectBookItems;
                    }
                    that.setState({
                        'projectBookItems':data.message.projectBook
                    },function(){
                        if(status == 'info'){
                            $('#projectBook input').attr('readonly','');
                            $('#projectBook textarea').attr('readonly','');
                            that.setState({
                                isEdit:false,
                                isShowCompile:{
                                    display:"none"
                                },
                                witchBook:"项目详情"
                            })
                        }else if(status == 'compile'){
                            $('#projectBook input').removeAttr('readonly');
                            $('#projectBook textarea').removeAttr('readonly');
                            that.setState({
                                isEdit:true,
                                isShowCompile:{
                                    display:"block"
                                },
                                witchBook:"项目详情"
                            })
                        }
                    })
                }
            }
        })
    }
    postName(){
        let newData = update(this.state.projectBookItems,{'projectName':{$set:this.refs.projectName.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postServerArea(){

        let newData = update(this.state.projectBookItems,{'projectServerArea':{$set:this.refs.projectServerArea.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postInPlace(){
        let newData = update(this.state.projectBookItems,{'projectInPlace':{$set:this.refs.projectInPlace.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postBudget(){
        let newData = update(this.state.projectBookItems,{'bookBudget':{$set:this.refs.bookBudget.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postNumber(){
        let newData = update(this.state.projectBookItems,{'beneficiaryNumber':{$set:this.refs.beneficiaryNumber.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postPrincipal(){
        let newData = update(this.state.projectBookItems,{'bookPrincipal':{$set:this.refs.bookPrincipal.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postDuty(){
        let newData = update(this.state.projectBookItems,{'bookDuty':{$set:this.refs.bookDuty.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postEmail(){
        let newData = update(this.state.projectBookItems,{'bookEmail':{$set:this.refs.bookEmail.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postPhone(){
        let newData = update(this.state.projectBookItems,{'bookPhone':{$set:this.refs.bookPhone.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postBgdArea(){
        let newData = update(this.state.projectBookItems,{'projectBgdArea':{$set:this.refs.projectBgdArea.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postTargetArea(){
        let newData = update(this.state.projectBookItems,{'projectTargetArea':{$set:this.refs.projectTargetArea.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postAssessmentResult(){
        let newData = update(this.state.projectBookItems,{'assessmentResultArea':{$set:this.refs.assessmentResultArea.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postPlanArea(){
        let newData = update(this.state.projectBookItems,{'servicePlanArea':{$set:this.refs.servicePlanArea.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postProjectStartTime(){
        let newData = update(this.state.projectBookItems,{'projectStartTime':{$set:this.refs.projectStartTime.value}});
        this.setState({
            projectBookItems:newData
        })
    }
    postProjectEndTime(){
        let newData = update(this.state.projectBookItems,{'projectEndTime':{$set:this.refs.projectEndTime.value}});
        this.setState({
            projectBookItems:newData
        })
    }
}
