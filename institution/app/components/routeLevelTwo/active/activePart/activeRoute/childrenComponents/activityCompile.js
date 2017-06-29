import React from 'react';
import update from 'react-addons-update';
import ActivityDetail from './activityDetail';
import {uploadImage} from '../../../../../../../lib/upload';
import {sendAjax,isVal,isMobile,CheckDateTime} from '../../../../../../../lib/commonEvent';
import {city} from '../../../../../../../lib/city';
let token = sessionStorage.getItem('token');
let contactProjects = [];
export default class ActivityCompile extends React.Component{
    constructor(){
        super()
        this.state = {
            previewInformation:{},
            'information':{},
            'projectType':[],
            cityIndex:0,
            province:"北京",
            cityList:[
                {
                    p:"北京",
                    c:[
                        {
                            n:"东城区"
                        }
                    ]
                }
            ],
            allProject:[
                {
                    id:'-1',
                    title:'请选择项目'
                }
            ],
            projectId:-1,
            contactProjectArr:[],
            isShowPoster:{
                display:'none'
            }
        }
    }
    render(){
        return(
            <div id="activityCompile" style={this.props.hideStyle}>
                <ActivityDetail previewInformation={this.state.previewInformation} />
                <div className="backBtn">
                    <span onClick={this.backList.bind(this)}>线下活动</span>
                    <span className="noChange">></span>
                    <span onClick={this.backActivityDetail.bind(this)}>活动详情</span>
                    <span className="noChange">></span>
                    <span>活动编辑</span>
                </div>
                <div className="tableContainer">
                    <table className="projectRouteTable tableOne">
                        <tbody>
                        <tr>
                            <td>活动名称</td>
                            <td>
                                <input type="text" value={this.state.information.title} onChange={this.postTitle.bind(this)} ref='title'/>
                            </td>
                        </tr>
                        <tr>
                            <td>报名截止时间</td>
                            <td>
                                <input type="text" ref="startTime" value={this.state.information.start_time} onChange={this.postStartTime.bind(this)} placeholder="如 2012-12-12 12:30:30"/>
                            </td>
                        </tr>
                        <tr>
                            <td>活动举行时间</td>
                            <td>
                                <input type="text" ref="endTime" value={this.state.information.end_time} onChange={this.postEndTime.bind(this)} placeholder="如 2012-12-12 12:30:30"/>
                            </td>
                        </tr>
                        <tr>
                            <td>报名费</td>
                            <td>
                                <span style={this.props.spanDefaultStyle} onClick={this.changeStyle.bind(this)} data-checked='1' ref="free">免费</span>
                                <span style={this.props.spanStyle} onClick={this.changeStyle.bind(this)} data-checked='0' ref='notFree'>收费</span>
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>
                                <input style={this.props.hideStyle} type="text" placeholder="输入报名费用" ref='charge' value={this.state.information.charge} onChange = {this.postCharge.bind(this)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>联系人</td>
                            <td>
                                <input type="text" value={this.state.information.contacts} onChange={this.postContacts.bind(this)} ref="contacts"/>
                            </td>
                        </tr>
                        <tr>
                            <td>联系电话</td>
                            <td>
                                <input type="text" value={this.state.information.mobile} onChange={this.postTel.bind(this)} ref="postTel"/>
                            </td>
                        </tr>
                        <tr>
                            <td>活动简介</td>
                            <td><input type="text" ref="description" placeholder="活动简介(20字以内)" value={this.state.information.description} onChange={this.postDescription.bind(this)}/></td>
                        </tr>
                        <tr style={this.state.isShowPoster}>
                            <td>选择关联项目</td>
                            <td>
                                <select name="" id="allProject" onChange={this.chooseProjectId.bind(this)} style={{width:'70%'}}>
                                    {
                                        this.state.allProject.map(function(item,i){
                                            return(<option value={item.id} key={i}>{item.title}</option>)
                                        }.bind(this))
                                    }
                                </select>
                                <div className="contactProject">
                                    {
                                        this.state.contactProjectArr.map(function(item,i){
                                            return(
                                                <span key={i}>
												{item.title}
                                                    <img src="./img/delete.png" onClick={this.cancelProject.bind(this,item.project_id)}/>
											</span>
                                            )
                                        }.bind(this))
                                    }
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <td>活动列表图</td>
                            <td>
                                <div className="ProjectUploadImg" style={{marginLeft:'0'}}>
                                    <div className="uploadImgBtn" id="activityCompileShow11Img">点击上传列表展示图</div>
                                    <div id="activityCompileShow" className="uploadImgContainer1">
                                        <img src={this.state.information.thumb} alt=""/>
                                    </div>
                                    <div className="uploadImgStatement" style={{textAlign:'left'}}>
                                        <img src="./img/imgStatement.png" alt=""/>
                                        (图片尺寸200x160 ,支持jpg/png)
                                    </div>
                                    <div id="isCompileShowImg" className="progressLine progressLine1"></div>
                                </div>
                            </td>
                        </tr>
                        <tr style={this.state.isShowPoster}>
                            <td>活动海报图</td>
                            <td ref="cover">
                                <div className="ProjectUploadImg" style={{marginLeft:'0'}}>
                                    <div style={{clear:'both',overflow:'hidden'}}>
                                        <div className="uploadImgBtn left" id="activityCompilePosterImg">点击上传活动海报</div>
                                        <div className="deletePoster left" onClick={this.deletePoster.bind(this)}>删除海报</div>
                                    </div>
                                    <div id="activityCompilePoster" className="uploadImgContainer2">
                                        <img src={this.state.information.poster} alt=""/>
                                    </div>
                                    <div className="uploadImgStatement" style={{textAlign:'left'}}>
                                        <img src="./img/imgStatement.png" alt=""/>
                                        (图片尺寸690x900, 支持jpg/png，非必填)
                                    </div>
                                    <div id="isCompilePosterImg" className="progressLine progressLine1"></div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    <table className="projectRouteTable tableTwo">
                        <tbody>
                        {/*<tr>
                            <td>活动状态</td>
                            <td>
                                <select name="projectState" id="" ref="projectState" onChange ={this.postProjectState.bind(this)}>
                                    <option value="0">募捐中</option>
                                    <option value="1">执行中</option>
                                    <option value="2">已结束</option>
                                </select>
                            </td>
                        </tr>*/}
                        <tr>
                            <td>活动人数</td>
                            <td>
                                <input type="number" ref='number' value={this.state.information.number} onChange={this.postNumber.bind(this)}/>
                            </td>
                        </tr>
                        <tr>
                            <td>省市</td>
                            <td>
                                <select name="" id="province2" >

                                </select>
                                <select name="" id="city2"  style={{marginLeft:"2%"}} >

                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td>活动举办地址</td>
                            <td>
                                <input type="text" placeholder="活动举办详细地址" value={this.state.information.location} onChange={this.postLocation.bind(this)} ref="postLocation"/>
                            </td>
                        </tr>
                        <tr>
                            <td>活动banner</td>
                            <td ref="cover">
                                <div className="ProjectUploadImg" style={{marginLeft:'0'}}>
                                    <div className="uploadImgBtn" id="activityCompileImg">点击上传封面图</div>
                                    <div id="activityUpLoadCompile" className="uploadImgContainer">
                                        <img src={this.state.information.banner} alt=""/>
                                    </div>
                                    <div className="uploadImgStatement">
                                        <img src="./img/imgStatement.png" alt=""/>
                                        (图片尺寸750x360 支持jpg/png)
                                    </div>
                                    <div id="activityCoPro" className="progressLine"></div>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="projectIntroduce">
                    <p className="introduceTitle">活动介绍：</p>
                    <div ref='content' id="UEditorActivityCompile" ></div>
                </div>
                <div className="btnBox" style={{width:'50%',margin:'20px auto',height:'36px',}}>
                    <div onClick={this.previewActivity.bind(this)}>预览</div>
                    <div onClick={this.savePage.bind(this)}>保存</div>
                </div>
            </div>
        )
    }
    componentWillReceiveProps(nextProps){
        this.getInformation(nextProps.status);
    }
    componentDidMount(){
        $('#coverBox').click(function(){
            $('#coverBox,.activityPreviewContainer').hide();
            $('#coverBox').css('background','rgba(51,51,51,0.3)')
        })
        let cityList = city().citylist;
        $.each(cityList,function(index,item){
            $("#province2").append("<option value='"+index+"'>"+item.p+"</option>")
        })
        $.each(cityList[0].c,function(index,item){
            $("#city2").append("<option  value='"+item.n+"'>"+item.n+"</option>")
        })
        $("#province2").on("change",function(event){
            let index = $(this).val()
            $("#city2").html("");
            $.each(cityList[index].c,function(index,item){
                $("#city2").append("<option value='"+item.n+"'>"+item.n+"</option>")
            })
        })
        uploadImage("activityCompileImg","activityCoPro",this,2,'activityUpLoadCompile');
        uploadImage("activityCompileShow11Img","isCompileShowImg",this,2,'activityCompileShow');
        uploadImage("activityCompilePosterImg","isCompilePosterImg",this,2,'activityCompilePoster');
        this.setUEditorActivityCompile();
        this.getAllProject()
    }
    setUEditorActivityCompile(){
        UE.delEditor('UEditorActivityCompile',{
            toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
        })
        window.activityEditor = UE.getEditor('UEditorActivityCompile',{
            toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
        })
    }
    //选择项目获取id
    chooseProjectId(event){
        let data = {};
        event = event || window.event;
        let projectId = event.target.value;
        if(projectId==-1){
            return;
        }
        if(contactProjects.indexOf(Number(projectId))==-1 && contactProjects.indexOf(String(projectId))==-1){
            contactProjects.push(projectId);
        }else{
            alert('该项目已选取过！');
            return;
        }
        let projectName = $(event.target).find('option:selected').text();
        data.project_id = projectId;
        data.title = projectName;
        let newArr = this.state.contactProjectArr;
        newArr.push(data);
        this.setState({
            contactProjectArr:newArr
        })

    }
    //预览活动
    previewActivity(){
        let content = activityEditor.getContent();
        this.state.information.content = content;
        this.setState({
            'previewInformation':this.state.information
        },function(){
            document.body.scrollTop = 0;
            $('#coverBox').css({
                'height':document.body.scrollHeight+'px',
                background:'#000'
            }).show();
            $('.activityPreviewContainer').show();
         $('.activityPreviewContainer').css('display','block')
        })
    }
    //关联项目删除
    cancelProject(id,event){
        event = event || window.event;
        $(event.target).parent('span').hide();
        for(let i=0; i<contactProjects.length; i++) {
            if(contactProjects[i] == Number(id)||contactProjects[i] == String(id)) {
                contactProjects.splice(i, 1);
            }
        }
    }
    //获取全部通过的项目
    getAllProject(){
        let token = sessionStorage.getItem('token');
        let self = this;
        sendAjax({
            url:'admin/project/findProjectUserList',
            type:'POST',
            data:{
                token:token
            },
            success:function(data){
                if(data.code==200){
                    let allProject = data.message;
                    if(data.message.length>0){
                        self.setState({
                            isShowPoster:{
                                display:''
                            }
                        })
                    }
                    allProject.unshift({id:'-1',title:'选择项目'});
                    self.setState({
                        allProject:allProject
                    })
                }
            }
        })
    }
    //报名收费样式
    changeStyle(e){
        $(e.target).attr('data-checked','1').css({'background':'#e7503d','color':'#fff'})
            .siblings().attr('data-checked','0').css({'background':'#fff','color':'#999'})
        if(e.target.innerText == '收费'){
            this.refs.charge.style.display = 'block';
        }else{
            this.refs.charge.style.display = 'none';
            let newData = update(this.state.information,{'charge':{$set:'0.00'}});
            this.setState({
                'information':newData
            })
        }
    }
    //返回列表页
    backList(){
        $("#activeList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#compile").addClass("hideItems");
        $("#exportEnroll,#putInEnroll").addClass("hideItems");
        this.props.callbackParent(0);
        this.props.isIndex(1);
    }
    //返回详情页
    backActivityDetail(){
        $("#activeInfo").show().siblings().hide();
        $("#compile").removeClass("hideItems")
    }
    //请求修改当前信息
    getInformation(id){
        let token = sessionStorage.getItem('token');
        let that = this;
        let cityList = city().citylist
        sendAjax({
            type:"POST",
            url:"admin/activity/findActivity",
            data:{
                token:token,
                id:id
            },
            success:function(data){
                if(data.code == 200){
                    let province =data.activity.province;
                    let city = data.activity.city;
                    let type = data.activity.type;
                    let typeList = $(that.refs.type).find("option");
                    let grade = data.activity.grade;
                    let orderTime = data.activity.end_time.substr(0,10).split("-");
                    orderTime = orderTime[0]+"-"+Number(orderTime[1])+"-"+Number(orderTime[2]);
                    let startTime = data.activity.start_time.substr(0,10).split("-");
                    if(data.activity.charge!='0.00'){
                        $(that.refs.notFree).attr('data-checked','1').css({'background':'#e7503d','color':'#fff'})
                            .siblings().attr('data-checked','0').css({'background':'#fff','color':'#999'});
                        that.refs.charge.style.display = 'block';
                    }else{
                        $(that.refs.free).attr('data-checked','1').css({'background':'#e7503d','color':'#fff'})
                            .siblings().attr('data-checked','0').css({'background':'#fff','color':'#999'});
                        that.refs.charge.style.display = 'none';
                    }
                    $("#activityUpLoadCompile").html('<img src="'+data.activity.banner+'" />');
                    $("#activityCompileShow").html('<img src="'+data.activity.thumb+'" />');
                    $("#activityCompilePoster").html('<img src="'+data.activity.poster+'" />');
                    $('#activityCoPro,#isCompileShowImg,#isCompilePosterImg').html('');
                    startTime = startTime[0]+"-"+Number(startTime[1])+"-"+Number(startTime[2]);
                    $(that.refs.projectState).val(data.activity.status);
                    activityEditor.setContent(data.activity.content);
                    let i = 0;
                    let provinceList = $("#province2").find("option");
                    $.each(provinceList,function(index,item){
                        $(item).attr('selected',false);
                        if($(item).text()==province){
                            $(item).attr("selected","selected");
                            i = index;
                        }
                    })
                    $("#city2").html("");
                    $.each(cityList[i].c,function(index,item){
                        $("#city2").append("<option  value='"+item.n+"'>"+item.n+"</option>")
                    })
                    contactProjects=[]
                    for(let i=0;i<data.activity.project.length;i++){
                        contactProjects.push(String(data.activity.project[i].project_id));
                    }
                    $("#city2").val(city);
                    that.setState({
                        'information':data.activity,
                        contactProjectArr:data.activity.project
                    },function(){
                        that.setState({
                            'information':update(that.state.information,{$merge:{'token':token}})
                        })
                    })
                }
            }
        })
    }
    postTitle(e){
        let newData = update(this.state.information,{'title':{$set:this.refs.title.value}});
        this.setState({
            'information':newData
        })
    }
    postDescription(){
        let newData = update(this.state.information,{'description':{$set:this.refs.description.value}});
        this.setState({
            'information':newData
        })
    }
    postEndTime(){
        let newData = update(this.state.information,{'end_time':{$set:this.refs.endTime.value}});
        this.setState({
            'information':newData
        })
    }
    postStartTime(){
        let newData = update(this.state.information,{'start_time':{$set:this.refs.startTime.value}});
        this.setState({
            'information':newData
        })
    }
    postContacts(){
        let newData = update(this.state.information,{'contacts':{$set:this.refs.contacts.value}});
        this.setState({
            'information':newData
        })
    }
    postTel(){
        let newData = update(this.state.information,{'mobile':{$set:this.refs.postTel.value}});
        this.setState({
            'information':newData
        })
    }
    postStatus(){
        let newData = update(this.state.information,{'project_state':{$set:this.refs.postStatus.value}});
        this.setState({
            'information':newData
        })
    }
    postProjectState(){
        let newData = update(this.state.information,{'projectState':{$set:Number(this.refs.projectState.value)}});
        this.setState({
            'information':newData
        })
    }
    postProvince(){
        let newData = update(this.state.information,{'province':{$set:this.refs.postProvince.value}});
        this.setState({
            'information':newData
        })
    }
    postCity(){
        let newData = update(this.state.information,{'city':{$set:this.refs.postCity.value}});
        this.setState({
            'information':newData
        })
    }
    postNumber(){
        let newData = update(this.state.information,{'number':{$set:this.refs.number.value}});
        this.setState({
            'information':newData
        })
    }
    postLocation(){
        let newData = update(this.state.information,{'location':{$set:this.refs.postLocation.value}});
        this.setState({
            'information':newData
        })
    }
    postGrade(){
        let newData = update(this.state.information,{'grade':{$set:this.refs.postGrade.value}});
        this.setState({
            'information':newData
        })
    }
    postCharge(){
        let newData = update(this.state.information,{'charge':{$set:this.refs.charge.value}});
        this.setState({
            'information':newData
        })
    }
    //删除海报
    deletePoster(){
        $("#activityCompilePoster,#isCompilePosterImg").html('');
        let newData = update(this.state.information,{'poster':{$set:''}});
        this.setState({
            'information':newData,
            activityCompilePosterImg:''
        })
        contactProjects = [];
    }
    savePage(){
        let token = sessionStorage.getItem('token');
        let that = this;
        //样式改变
        let information = that.state.information;
        let title = information.title;
        if(title == ''){
            alert('请输入活动名称');
            return
        }else if(title.length>12 || title.length<4){
            alert('项目名称4-12字以内');
            return
        }
        //提交后子组件拿到banner链接
        let banner = information.banner;
        if(isVal(this.state.banner)!=''){
            banner = this.state.banner;
        }
        let thumb = information.thumb;
        if(isVal(this.state.activityCompileShow11Img)!=''){
            information.thumb = this.state.activityCompileShow11Img;
        }
        if(isVal(this.state.activityCompilePosterImg)!=''){
            information.poster = this.state.activityCompilePosterImg;
        }
        if(isVal(this.state.activityCompilePosterImg)!=''||information.poster!=''){
            if(isVal(contactProjects)==''){
                alert('请选择关联项目！');
                return;
            }
        }else{
            contactProjects = [];
        }
        let location = information.location;
        if(location == ''){
            alert('请输入详细地址');
            return
        }else if(location.length>30){
            alert('详细地址不能超过30字');
            return
        }
        if(this.refs.notFree.getAttribute('data-checked') == '1' && this.refs.charge.value == ''){
            alert('请输入报名费用金额');
            return;
        }
        let charge = '0'
        if(this.refs.notFree.getAttribute('data-checked') == '1'){
            charge = information.charge;
        }
        let number = information.number;
        if(number==''){
            alert('活动人数不能为空');
            return;
        }
        let contacts = information.contacts;
        if(contacts == ''){
            alert('请输入联系人');
            return
        }
        let mobile = information.mobile;
        if(mobile == ''){
            alert('请输入电话号码');
            return
        }else if(!isMobile(mobile)){
            alert("电话号码不符合规则");
            return;
        }
        let originNum = this.state.information.num;
        if(this.refs.number.value<originNum){
            alert('活动人数不能小于已报名人数！');
            return;
        }
        let content = activityEditor.getContent();
        if(content==""){
            alert("活动介绍不能为空");
            return;
        }
        let description = information.description;
        if(isVal(description)==""){
            alert("活动简介不能为空");
            return;
        }else if(description.length>20){
            alert("活动简介20字以内");
            return;
        }
        let province = $("#province2").find("option:selected").text();
        let city = $("#city2").val();
        information.province = province;
        information.city = city;
        if(information.end_time==""){
            alert("活动举办时间不能为空！");
            return;
        }
        if(information.start_time==''){
            alert("活动报名截止时间不能为空！");
            return;
        }
        information.content = content;
        information.banner = banner;
        information.projectId = contactProjects;
        information.token = token;
        delete information.activityRegisters;
        delete information.project;
        //提交的information没问题
        sendAjax({
            type:"POST",
            url:"admin/activity/editActivity",
            data:information,
            success:function(data){
                if(data.code == 200){
                    $("#coverBox").height('100%');
                    $('#loader,#coverBox').hide();
                    alert('保存成功！');
                    window.location.reload();
                    that.props.callbackParent(0);
                    $('#activeList').css('display','block').siblings().css('display','none');
                    $('#addNewContainer').remove();
                    $('.checkAll').css('overflow','visible').siblings().removeClass('hideItems');
                    $("#compile").addClass("hideItems");
                    $('.activeItemsCheckGather').css('background',"#e7503d url('img/arrow_down.jpg') no-repeat 96% center").siblings().addClass('hideItems');
                    $('.operationBar').css('overflow','visible');
                    $("#activityCoPro").html('');
                }else if(data.code==206&&data.message=='The start time is not a valid date.'){
                    alert("报名截止时间格式不正确！")
                }else if(data.code==206&&data.message=='The end time is not a valid date.'){
                    alert("活动举行时间格式不正确！")
                }else{
                    alert(data.message);
                }
            }
        })
    }
}