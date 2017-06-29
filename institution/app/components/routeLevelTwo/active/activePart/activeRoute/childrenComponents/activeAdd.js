import React from 'react';
import {uploadImage} from '../../../../../../../lib/upload';
import ActivityDetail from './activityDetail';
import {city} from '../../../../../../../lib/city';
import {sendAjax,isVal,isMobile} from '../../../../../../../lib/commonEvent'
import './index.less'
let contactProjects = [];
export default class ActiveAdd extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'postInformation':{},
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
			cityIndex:0,
			province:"北京",
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
			},
			previewInformation:{}
		}
	}
	render(){
		return(
			<div id="activeAdd" style={this.props.hideStyle}>
				<ActivityDetail previewInformation={this.state.previewInformation} />
				<div className="backBtn">
					<span onClick={this.backList.bind(this)}>线下活动</span>
					<span className="noChange">></span>
					<span>活动添加</span>
				</div>
				<table className="projectRouteTable tableOne">
					<tbody>
					<tr>
						<td>活动名称</td>
						<td>
							<input type="text" ref='title'/>
						</td>
					</tr>
					<tr>
						<td>活动人数</td>
						<td>
							<input type="number" ref='number'/>
						</td>
					</tr>
					<tr>
						<td>报名费</td>
						<td>
							<span style={this.props.spanDefaultStyle} onClick={this.changeStyle.bind(this)} data-checked='1'>免费</span>
							<span style={this.props.spanStyle} onClick={this.changeStyle.bind(this)} data-checked='0' ref='notFree'>收费</span>
						</td>
					</tr>
					<tr>
						<td></td>
						<td>
							<input style={this.props.hideStyle} type="text" placeholder="输入报名费用" ref='charge'/>
						</td>
					</tr>
					<tr>
						<td>报名截止时间</td>
						<td ref='start_time'  style={{width:"70%"}}>
							<input type="text" ref="startTime" placeholder="如2012-12-12 12:30:30"/>
						</td>
					</tr>
					<tr>
						<td>活动举行时间</td>
						<td ref='end_time'  style={{width:"70%"}}>
							<input type="text" ref="endTime" placeholder="如2012-12-12 12:30:30"/>
						</td>
					</tr>
					<tr style={this.state.isShowPoster}>
						<td>选择关联项目</td>
						<td>
							<select name="" id="" onChange={this.chooseProjectId.bind(this)} style={{width:'70%'}}>
								{
									this.state.allProject.map(function(item,i){
										return(<option value={item.id} key={i}>{item.title}</option>)
									}.bind(this))
								}
							</select><br/>
							<div className="contactProject">
								{
									this.state.contactProjectArr.map(function(item,i){
										return(
											<span key={i}>
												{item.projectName}
												<img src="./img/delete.png" onClick={this.cancelProject.bind(this,item.projectId)}/>
											</span>
										)
									}.bind(this))
								}
							</div>
						</td>
					</tr>
					</tbody>
				</table>
				<table className="projectRouteTable tableTwo">
					<tbody>
					<tr>
						<td>省市</td>
						<td>
							<select name="" id="province1" ref="province"  onChange ={this.chooseProvince.bind(this)}>
								{
									this.state.cityList.map(function(item,index){
										return(<option value={index} key={index} >{item.p}</option>)
									}.bind(this))
								}
							</select>
							<select name="" id="city1" ref="city" style={{marginLeft:"2%"}}>
								{
									this.state.cityList[this.state.cityIndex].c.map(function(item,index){
										return(<option key={index} value={item.n}>{item.n}</option>)
									}.bind(this))
								}
							</select>
						</td>
					</tr>
					<tr>
						<td>活动举办地址</td>
						<td>
							<input type="text" placeholder="活动举办详细地址" ref='location'/>
						</td>
					</tr>
					<tr>
						<td>联系人</td>
						<td>
							<input type="text" ref='contacts'/>
						</td>
					</tr>
					<tr>
						<td>联系电话</td>
						<td>
							<input type="number" ref='mobile'/>
						</td>
					</tr>
					<tr>
						<td>活动简介</td>
						<td>
							<input type="text" placeholder="活动简介(20字以内)" ref="description"/>
						</td>
					</tr>
					</tbody>
				</table>
				<div className="coverBanner">
					<p>上传图片</p>
					<div className="ProjectUploadImg">
						<div className="uploadImgBtn" id="activityAddBannerImg">点击上传活动头图</div>
						<div id="activityUpLoadImg" className="uploadImgContainer"></div>
						<div className="uploadImgStatement">
							<img src="./img/imgStatement.png" alt=""/>
							(图片尺寸750x360 ,支持jpg/png)
						</div>
						<div id="activityABPL" className="progressLine"></div>
					</div>
					<div className="ProjectUploadImg">
						<div className="uploadImgBtn" id="activityAddShowImg">点击上传列表展示图</div>
						<div id="activityShowImg" className="uploadImgContainer1"></div>
						<div className="uploadImgStatement uploadImgStatement1">
							<img src="./img/imgStatement.png" alt=""/>
							(图片尺寸200x160 ,支持jpg/png)
						</div>
						<div id="isShowImg" className="progressLine progressLine1"></div>
					</div>
					<div className="ProjectUploadImg" style={this.state.isShowPoster}>
						<div style={{clear:'both',overflow:'hidden'}}>
							<div className="uploadImgBtn left" id="activityAddPosterImg">点击上传活动海报</div>
							<div className="deletePoster left" onClick={this.deletePoster.bind(this)}>删除海报</div>
						</div>
						<div id="activityPosterImg" className="uploadImgContainer2"></div>
						<div className="uploadImgStatement uploadImgStatement1">
							<img src="./img/imgStatement.png" alt=""/>
							(图片尺寸690x900, 支持jpg/png，非必填)
						</div>
						<div id="isPosterImg" className="progressLine progressLine1"></div>
					</div>
				</div>
				<div className="projectIntroduce">
					<p className="introduceTitle">活动介绍</p>
					<div id="UEditorAdd"></div>
				</div>
				<div className="btnBox" style={{width:'50%',margin:'20px auto',height:'36px',}}>
					<div onClick={this.previewActivity.bind(this)}>预览</div>
					<div onClick={this.submitInfo.bind(this)}>提交</div>
				</div>
			</div>
		)
	}
	componentDidMount(){
		this.setUEditor();
		$('#coverBox').click(function(){
			$('#coverBox,.activityPreviewContainer').hide();
			$('#coverBox').css('background','rgba(51,51,51,0.3)')
		})
		uploadImage("activityAddBannerImg","activityABPL",this,2,'activityUpLoadImg');
		uploadImage("activityAddShowImg","isShowImg",this,2,'activityShowImg');
		uploadImage("activityAddPosterImg","isPosterImg",this,2,'activityPosterImg');
		let cityList = city().citylist
		this.setState({
			cityList:cityList
		})
		this.getAllProject();
	}
	//选择项目获取id
	chooseProjectId(event){
		let data = {};
		event = event || window.event;
		let projectId = event.target.value;
		if(projectId==-1){
			return;
		}
		if(contactProjects.indexOf(projectId)==-1){
			contactProjects.push(projectId);
		}else{
			alert('该项目已选取过！');
			return;
		}
		let projectName = $(event.target).find('option:selected').text();
		data.projectId = projectId;
		data.projectName = projectName;
		let newArr = this.state.contactProjectArr;
		 newArr.push(data);
		this.setState({
			contactProjectArr:newArr
		})

	}
	//关联项目删除
	cancelProject(id,event){
		event = event || window.event;
		for(let i=0; i<contactProjects.length; i++) {
			if(contactProjects[i] == id) {
				contactProjects.splice(i, 1);
				$(event.target).parent('span').hide();
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
	backList(){
		$("#activeList").show().siblings().hide();
		$(".checkAll").siblings().removeClass("hideItems");
		$('#compile').addClass('hideItems');
		$("#exportEnroll,#putInEnroll").addClass("hideItems");
		this.props.callbackParent(0);
	}
	//选择省后改变市列表
	chooseProvince(event){
		let e = event || window.event;
		let index = $(e.target).val();
		let province = $(e.target).find("option:selected").text();
		this.setState({
			cityIndex:index,
			province:province
		})
	}
	submitInfo(){
		this.collectInformation();
	}
	collectInformation(){
		let token = sessionStorage.getItem('token');
		let title = this.refs.title.value;
		if(title==""){
			alert("请输入活动名称！");
			return;
		}else if(title.length>12 || title.length<4){
			alert("活动名称4-12字以内！");
			return;
		}
		let number = this.refs.number.value;
		if(isVal(number)==""){
			alert("请输入活动人数！");
			return;
		}
		if(this.refs.notFree.getAttribute('data-checked') == '1' && this.refs.charge.value == ''){
			alert('请输入报名费用金额');
			return;
		}
		let charge = '0'
		if(this.refs.notFree.getAttribute('data-checked') == '1'){
			charge = this.refs.charge.value==''?'0':this.refs.charge.value;
		}
		let start_time = this.refs.startTime.value;
		if(start_time==''){
			alert("报名截止时间不能为空！");
			return;
		}
		let end_time = this.refs.endTime.value;
		if(end_time==""){
			alert("活动举办时间不能为空！");
			return;
		}
		let startTime = new Date(start_time.replace(/-/g, "/")).getTime();
		let endTime = new Date(end_time.replace(/-/g, "/")).getTime();
		if(startTime>=endTime){
			alert("报名截止时间不能晚于等于活动举办时间！");
			return;
		}
		//提交后子组件拿到banner链接
		let banner = this.state.cover;
		if(isVal(banner)==""){
			alert("请选择封面图！");
			return;
		}
		let thumb = this.state.activityAddShowImg;
		if(isVal(thumb)==''){
			alert('请选择列表展示图！');
			return;
		}
		let poster = this.state.activityPosterImg;
		if(isVal(poster)==''){
			poster = '';
			contactProjects = [];
		}else if(isVal(poster)!=''&&isVal(contactProjects)==""){
			alert('未选择关联项目!');
			return;
		}
		//富文本编辑器实例化一次
		let content = activityAddEditor.getContent();
		if(content==""){
			alert("活动简介不能为空！");
			return;
		}
		let province = this.state.province;
		let city = this.refs.city.value;
		let location = this.refs.location.value;
		if(isVal(location) == ''){
			alert('请输入详细地址');
			return
		}else if(location.length>30){
			alert('详细地址不能超过30字');
			return
		}
		let contacts = this.refs.contacts.value;
		if(isVal(contacts)==''){
			alert("请输入联系人！");
			return;
		}
		let mobile = this.refs.mobile.value;
		if(isVal(mobile)==""){
			alert("请输入联系电话！");
			return;
		}else if(!isMobile(mobile)){
			alert("联系电话不符合规则！");
			return;
		}
		let description = this.refs.description.value;
		if(description==''){
			alert('活动简介不能为空！');
			return;
		}else if(description.length>20){
			alert('活动简介20字以内！');
			return;
		}
		this.setState({
			'postInformation':{
				'token':token,
				'title':title,
				'number':number,
				'charge':charge,
				'start_time':start_time,
				'end_time':end_time,
				'banner':banner,
				thumb:thumb,
				poster:poster,
				projectId:contactProjects,
				'content':content,
				'province':province,
				'city':city,
				'location':location,
				'contacts':contacts,
				'mobile':mobile,
				sort:0,
				district:'某县',
				description:description
			}
		},function(){
			this.postInformation(this.state.postInformation)
		})
	}
	//预览活动
	previewActivity(){
		let title = this.refs.title.value;
		if(title==""){
			alert("请输入活动名称！");
			return;
		}else if(title.length>12 || title.length<4){
			alert("活动名称4-12字以内！");
			return;
		}
		let number = this.refs.number.value;
		if(isVal(number)==""){
			alert("请输入活动人数！");
			return;
		}
		if(this.refs.notFree.getAttribute('data-checked') == '1' && this.refs.charge.value == ''){
			alert('请输入报名费用金额');
			return;
		}
		let charge = '0'
		if(this.refs.notFree.getAttribute('data-checked') == '1'){
			charge = this.refs.charge.value==''?'0':this.refs.charge.value;
		}
		let start_time = this.refs.startTime.value;
		if(start_time==''){
			alert("报名截止时间不能为空！");
			return;
		}
		let end_time = this.refs.endTime.value;
		if(end_time==""){
			alert("活动举办时间不能为空！");
			return;
		}
		let startTime = new Date(start_time.replace(/-/g, "/")).getTime();
		let endTime = new Date(end_time.replace(/-/g, "/")).getTime();
		if(startTime>=endTime){
			alert("报名截止时间不能晚于等于活动举办时间！");
			return;
		}
		//提交后子组件拿到banner链接
		let banner = this.state.cover;
		if(isVal(banner)==""){
			alert("请选择封面图！");
			return;
		}

		//富文本编辑器实例化一次
		let content = activityAddEditor.getContent();
		if(content==""){
			alert("活动简介不能为空！");
			return;
		}
		let province = this.state.province;
		let city = this.refs.city.value;
		let location = this.refs.location.value;
		if(isVal(location) == ''){
			alert('请输入详细地址');
			return
		}else if(location.length>30){
			alert('详细地址不能超过30字');
			return
		}
		let description = this.refs.description.value;
		if(description==''){
			alert('活动简介不能为空！');
			return;
		}else if(description.length>20){
			alert('活动简介20字以内！');
			return;
		}
		this.setState({
			'previewInformation':{
				'title':title,
				'number':number,
				'charge':charge,
				'start_time':start_time,
				'end_time':end_time,
				'banner':banner,
				'content':content,
				'province':province,
				'city':city,
				'location':location,
				description:description
			}
		},function(){
			document.body.scrollTop = 0;
			$('#coverBox').css({
				'height':document.body.scrollHeight+'px',
				background:'#000'
			}).show();
			$('.activityPreviewContainer').show();
		})
	}
	postInformation(info){
		let token = sessionStorage.getItem('token');
		let that = this;
		sendAjax({
			type:"POST",
			url:"admin/activity/addActivity",
			data:info,
			success:function(data){
					if (data.code == 200) {
						alert('添加成功');
						that.props.callbackParent(0);
						$('#activeList').css('display', 'block').siblings().css('display', 'none');
						$("#increase").removeClass('hideItems');
						location.reload();
					}else if(data.code==206&&data.message=='The start time is not a valid date.'){
						alert("报名截止时间格式不正确！")
					}else if(data.code==206&&data.message=='The end time is not a valid date.'){
						alert("活动举行时间格式不正确！")
					}else{
						//添加提示-----------------------------------------------
						alert(data.message)
						//------------------------------------------------------
					}
			},
			beforeSend: function(XMLHttpRequest){
				let height = document.getElementsByTagName('body')[0].scrollHeight;
				$("#coverBox").height(height+'px');
				$('#loader,#coverBox').show();
			},
			complete :function(XMLHttpRequest, TS){
				$("#coverBox").height('100%');
				$('#loader,#coverBox').hide();
			}
		})
	}
	changeStyle(e){
		$(e.target).attr('data-checked','1').css({'background':'#e7503d','color':'#fff'})
			.siblings().attr('data-checked','0').css({'background':'#fff','color':'#999'})
		if(e.target.innerText == '收费'){
			this.refs.charge.style.display = 'block';
		}else{
			this.refs.charge.style.display = 'none'
		}
	}
	//删除海报
	deletePoster(){
		$("#activityPosterImg,#isPosterImg").html('');
		this.setState({
			activityPosterImg:''
		})
		contactProjects = [];
	}
	setUEditor(){
		$('#edui_fixedlayer').empty();
		UE.delEditor('UEditorAdd',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		})
		window.activityAddEditor = UE.getEditor('UEditorAdd',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		})
		activityAddEditor.ready(function(){
			activityAddEditor.setContent("<p>1、活动详细信息，活动名称，活动主题，报名时间，举办时间，活动地点，参与费用，总人数；</p><p>2、重要提示（适应人群参与、风险提示，免责提示）等；</p><p>3、发起机构简介；建议图文结合，一段文字+一张图片+一段文字+一张图片；要求图片横版，清晰</p><p><br/></p>");
		})
	}
}


