import React from 'react';
import update from 'react-addons-update';
import {uploadImage} from '../../../../../../../lib/upload';
import ProjectDetail from './projectDetail';
import {sendAjax,isVal,isMobile} from '../../../../../../../lib/commonEvent';
import {city} from '../../../../../../../lib/city'

let projectBook = {
	'textDecoration':'underline',
	'cursor':'pointer'
}
export default class ProjectAdd extends React.Component{
	constructor(){
		super()
		this.state = {
			'projectType':[],
			'postInformation':{},
			previewInformation:{}
		}
	}
	render(){
		return(
			<div id="projectAdd" style={this.props.hideStyle}>
				<ProjectDetail previewInformation={this.state.previewInformation} />
				<div className="backBtn">
					<span onClick={this.backList.bind(this)}>募捐项目</span>
					<span className="noChange">></span>
					<span>项目添加</span>
				</div>
				<div className="tableContainer">
					<table className="projectRouteTable tableOne">
						<tbody>
							<tr>
								<td>项目名称</td>
								<td>
									<input type="text" ref='title'/>
								</td>
							</tr>
							<tr>
								<td>项目类别</td>
								<td>
									<select ref="projectType" onChange={this.changeTypeId.bind(this)}>
										{
											this.state.projectType.map(function(item,index){
												return(
													<option key={index} data-typeId={item.id}>{item.name}</option>
												)
											}.bind(this))
										}
									</select>
								</td>
							</tr>
							<tr>
								<td>筹款目标</td>
								<td>
									<input type="number" ref="money" placeholder="如不设目标，请勿填写"/>
								</td>
							</tr>
							<tr>
								<td>结束时间</td>
								<td className="projectEndTime"><input type="text" ref="endTime" placeholder="如2012-12-12 12:80:30，如不设，请勿填"/></td>
							</tr>
							<tr>
								<td>联系人</td>
								<td>
									<input type="text" ref="liable"/>
								</td>
							</tr>
							<tr>
								<td>联系电话</td>
								<td>
									<input type="number" ref="mobile"/>
								</td>
							</tr>
						</tbody>
					</table>
					<table className="projectRouteTable tableTwo">
						<tbody>
							<tr>
								<td>项目书</td>
								<td style={projectBook} onClick={this.showBook.bind(this)} className="cursorPointer">项目书</td>
							</tr>
							<tr>
								<td>省市</td>
								<td>
									<select name="" id="province" className="prov" >

									</select>
									<select name="" id="city" style={{marginLeft:"2%"}} className="city" >

									</select>
								</td>
							</tr>
							<tr>
								<td>项目执行地</td>
								<td>
									<input type="text" ref="location" placeholder="项目执行详细地址"/>
								</td>
							</tr>
							<tr>
								<td>项目捐款方式</td>
								<td>
									单次
									{/*<select ref="donation">
										<option value="0">单次</option>
										<option value="1">日捐</option>
									</select>*/}
								</td>
							</tr>
							<tr>
								<td>项目简介</td>
								<td>
									<input type="text" placeholder="项目简介(20字以内)" ref="description"/>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div className="coverBanner">
					<p>上传图片</p>
					<div className="ProjectUploadImg">
						<div className="uploadImgBtn" id="projectAddBannerImg">点击上传封面图</div>
						<div id="projectUpLoadImg" className="uploadImgContainer"></div>
						<div className="uploadImgStatement">
							<img src="./img/imgStatement.png" alt=""/>
							(图片尺寸750x360 支持jpg/png)
						</div>
						<div id="projectABPL" className="progressLine"></div>
					</div>
					<div className="ProjectUploadImg">
						<div className="uploadImgBtn" id="projectAddShowImg">点击上传列表展示图</div>
						<div id="projectShowImg" className="uploadImgContainer1"></div>
						<div className="uploadImgStatement uploadImgStatement1">
							<img src="./img/imgStatement.png" alt=""/>
							(图片尺寸200x160 ,支持jpg/png)
						</div>
						<div id="isShowImg" className="progressLine progressLine1"></div>
					</div>
				</div>
				<div className="projectIntroduce">
					<p className="introduceTitle">项目介绍</p>
					<div id="UEditorAddProject"></div>
				</div>
				<div className="btnBox" style={{width:'50%',margin:'20px auto',height:'36px',}}>
					<div onClick={this.previewProject.bind(this)}>预览</div>
					<div onClick={this.postInformation.bind(this)}>提交</div>
				</div>
			</div>
		)
	}
	componentDidMount(){
		this.setUEditor();
		let self = this;
		this.getProjectType();
		$('#coverBox').click(function(){
			$('#coverBox,.projectPreviewContainer').hide();
			$('#coverBox').css('background','rgba(51,51,51,0.3)')
		})
		uploadImage("projectAddBannerImg","projectABPL",this,2,'projectUpLoadImg');
		uploadImage("projectAddShowImg","isShowImg",this,2,'projectShowImg');
		let cityList = city().citylist;
		$.each(cityList,function(index,item){
			$("#province").append("<option value='"+index+"'>"+item.p+"</option>")
		});
		$.each(cityList[0].c,function(index,item){
			$("#city").append("<option  index='"+item.n+"' value='"+item.n+"'>"+item.n+"</option>")
		})
		$("#province").find("option").click(function(){
			let index = this.getAttribute("index")
		})
		$("#province").on("change",function(event){
			let index = $(this).val();
			$("#city").html("");
			$.each(cityList[index].c,function(index,item){
				$("#city").append("<option value='"+item.n+"'>"+item.n+"</option>")
			})
		})
	}
	componentWillReceiveProps(nextProps){
		this.mixInformation(nextProps.projectBook);
	}
	backList(){
		$("#projectList").show().siblings().hide();
		$(".checkAll").siblings().removeClass("hideItems");
		$("#compile").addClass("hideItems");
		this.props.callbackParent(0);
	}
	//合并项目书中的内容
	mixInformation(obj){
		this.setState({
			'postInformation':update(this.state.postInformation,{$merge:{'projectBook':obj}})
		})
	}
	setUEditor(){
		UE.delEditor('UEditorAddProject',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		})
		window.projectAddEditor = UE.getEditor('UEditorAddProject',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		});
		projectAddEditor.ready(function(){
			projectAddEditor.setContent("<p>【我们要做什么】请说明项目背景、受助地区、受助对象、帮扶方式，可生动地讲述项目中让人感触的事件或让人感动的故事。</p><p>（建议图文结合，一段文字+一张图片+一段文字+一张图片的样式，每段文字建议不超过100字，图片画面清晰且内容美好积极，</p><p>下同，请参考平台其他项目：</p><p>【我们要怎么做】请说明项目执行计划、执行时间节点、项目预算表（建议用表格）。</p><p>【执行机构简介】可用文字简单介绍执行机构。</p>");
		})
	}
	getProjectType(){
		let token = sessionStorage.getItem('token');
		let self = this;
		sendAjax({
			type:"POST",
			url:"admin/project/findProjectType",
			data:{
				token:token
			},
			success:function(data){
				let newData = update(self.state.projectType,{$set:data.message});
				self.setState({
					'projectType':newData
				},function(){
					self.refs.projectType.setAttribute('data-typeId',self.state.projectType[0].id);
				})
			}
		})
	}
	postInformation(){
		this.collectInformation();
	}
	collectInformation(){
		let token = sessionStorage.getItem('token');
		let title = this.refs.title.value;
		if(title == ''){
			alert('请输入项目名称');
			return
		}else if(title.length>10 ){
			alert('项目名称10字以内');
			return
		}
		let money = this.refs.money.value;
		if(money==''){
			money = 0;
		}else if(money<1){
			alert('筹款目标不能小于1');
			return
		}else if(money>1000000000){
			alert('筹款目标不能超过10亿');
			return
		}
		let location = this.refs.location.value;
		if(location == ''){
			alert('请输入详细地址');
			return
		}else if(location.length>30){
			alert('详细地址不能超过30字');
			return
		}
		let liable = this.refs.liable.value;
		if(liable == ''){
			alert('请输入联系人');
			return
		}else if(liable.length>10||liable.length<2){
			alert('联系人2-10字以内！');
			return;
		}

		let description = this.refs.description.value;
		if(description==""){
			alert("项目简介不能为空！");
			return;
		}else if(description.length>20){
			alert("项目简介20字以内！");
			return;
		}
		let mobile = this.refs.mobile.value;
		if(mobile == ''){
			alert('请输入电话号码');
			return
		}else if(!isMobile(mobile)){
			alert("电话号码不符合规则！");
			return;
		}
		let projectBook = this.state.postInformation.projectBook;
		if(isVal(projectBook)==""){
			projectBook={}
		}
		let content = projectAddEditor.getContent();
		if(content==''){
			alert("项目介绍不能为空！");
			return;
		}
		if(isVal(this.state.cover)==''){
			alert('请上传banner');
			return
		}
		if(isVal(this.state.projectAddShowImg)==''){
			alert('请上传列表展示图！');
			return;
		}
		let projectType = this.refs.projectType.getAttribute('data-typeId');
		//let donation = this.refs.donation.value;
		let donation = 0;
		let province = $("#province").find("option:selected").text();
		let city = $("#city").val();
		let endTime =this.refs.endTime.value;
		let now_time = new Date(new Date()).getTime();
		let end_time = new Date(endTime.replace(/-/g, "/")).getTime();
		if(end_time<now_time){
			alert('结束时间不能小于当前时间！');
			return;
		}
		if(endTime==''){
			endTime = '2038-01-10';
		}
		this.setState({
			'postInformation':{
				'token':token,
				'title':title,
				'content':content,
				'projectType':projectType,
				'donation':donation,
				'money':money,
				'province':province,
				'city':city,
				'location':location,
				'cover':this.state.cover,
				thumb:this.state.projectAddShowImg,
				'liable':liable,
				'mobile':mobile,
				'grade':1,
				'projectBook':projectBook,
				'endTime':endTime,
				description:description
			}
		},function(){
			this.sendInformation();
		})
	}
	//项目预览
	previewProject(){
		let title = this.refs.title.value;
		if(title == ''){
			alert('请输入项目名称');
			return
		}else if(title.length>10 ){
			alert('项目名称10字以内');
			return
		}
		let money = this.refs.money.value;
		if(money==''){
			money = 0;
		}else if(money<1){
			alert('筹款目标不能小于1');
			return
		}else if(money>1000000000){
			alert('筹款目标不能超过10亿');
			return
		}
		let content = projectAddEditor.getContent();
		if(content==''){
			alert("项目介绍不能为空！");
			return;
		}
		if(isVal(this.state.cover)==''){
			alert('请上传banner');
			return
		}
		let projectType = this.refs.projectType.value;
		let donation = 0;
		this.setState({
			'previewInformation':{
				'title':title,
				'content':content,
				'projectType':projectType,
				'donation':donation,
				'money':money,
				'cover':this.state.cover,
			}
		},function(){
			document.body.scrollTop = 0;
			$('#coverBox').css({
				'height':document.body.scrollHeight+'px',
				background:'#000'
			}).show();
			$('.projectPreviewContainer').show();
		})
	}
	//保存生成项目
	sendInformation(){
		let self = this;
		sendAjax({
			type:"POST",
			url:"admin/project/addProject",
			data:this.state.postInformation,
			success:function(data){
				$("#coverBox").height('100%');
				$('#loader,#coverBox').hide();
				if(data.code == 200){
					alert('添加成功');
					projectAddEditor.setContent("<p>【我们要做什么】请说明项目背景、受助地区、受助对象、帮扶方式，可生动地讲述项目中让人感触的事件或让人感动的故事。</p><p>（建议图文结合，一段文字+一张图片+一段文字+一张图片的样式，每段文字建议不超过100字，图片画面清晰且内容美好积极，</p><p>下同，请参考平台其他项目：</p><p>【我们要怎么做】请说明项目执行计划、执行时间节点、项目预算表（建议用表格）。</p><p>【执行机构简介】可用文字简单介绍执行机构。</p>");
					$("#postfiles").html("");
					self.props.callbackParent(0);
					self.clearInformation();
					self.changeStyle();
					location.reload();
				}else if(data.code==206&&data.message=='The end time is not a valid date.'){
					alert('结束时间格式不正确，请重新输入(正确格式如:2012-12-12)');
				}else{
					alert(data.message);
				}
				self.props.callbackParent(0);
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
	changeStyle(){
		$('operationBar').css('overflow','visible');
		$('.checkAll').css('overflow','visible').siblings().removeClass('hideItems');
		$("#compile").addClass("hideItems")
		$('.activeItemsCheckGather').css('background',"#e7503d url('img/arrow_down.jpg') no-repeat 96% center").siblings().addClass('hideItems');
		$('#projectList').css('display','block').siblings().css('display','none');
	}
	changeTypeId(){
		let newTypeId = $(this.refs.projectType).find('option:selected').attr('data-typeId')
		$(this.refs.projectType).attr('data-typeId',newTypeId);
	}
	clearInformation(){
		$('input').each(function(){
			this.value = '';
		})
		$('#browse').html('');
	}
	showBook(){
		$('#projectBook').css('display','block').siblings().css('display','none');
		this.props.projectBookStatusBack('empty');
	}
}
