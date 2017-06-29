import React from 'react';
import update from 'react-addons-update';
import {uploadImage} from '../../../../../../../lib/upload';
import {sendAjax,isVal,isMobile} from '../../../../../../../lib/commonEvent';
import ProjectDetail from './projectDetail';
import {city} from '../../../../../../../lib/city';
const token = sessionStorage.getItem('token');
export default class ProjectCompile extends React.Component{
	constructor(){
		super()
		this.state = {
			'information':{},
			previewInformation:{},
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
			]
		}
	}
	render(){
		return(
			<div id="projectCompile" style={this.props.hideStyle}>
				<ProjectDetail previewInformation={this.state.previewInformation} />
				<div className="backBtn">
					<span onClick={this.backList.bind(this)}>募捐项目</span>
					<span className="noChange">></span>
					<span onClick={this.backProjectDetail.bind(this)}>项目详情</span>
					<span className="noChange">></span>
					<span>项目编辑</span>
				</div>
				<div className="tableContainer">
					<table className="projectRouteTable tableOne">
						<tbody>
						<tr>
							<td>项目名称</td>
							<td>
								<input type="text" value={this.state.information.title} onChange={this.postTitle.bind(this)} ref='title'/>
							</td>
						</tr>
						<tr>
							<td>项目类别</td>
							<td>
								<select ref='type' onChange={this.postType.bind(this)} id="projectType">
									{
										this.state.projectType.map(function(item,index){
											return(
												<option key={index} value={item.id}>{item.name}</option>
											)
										}.bind(this))
									}
								</select>
							</td>
						</tr>
						<tr>
							<td>配捐比例</td>
							<td>
								{this.state.information.matchRatio==""?"无":this.state.information.matchRatio=="0.00"?"无":this.state.information.matchRatio}
							</td>
						</tr>
						<tr>
							<td>配捐企业</td>
							<td>
								{this.state.information.matchFirm==""?"无":this.state.information.matchFirm}
							</td>
						</tr>
						<tr>
							<td>筹款目标</td>
							<td>
								<input type="text" placeholder="如不设目标，请勿填写" value={this.state.information.money} onChange={this.postMoney.bind(this)} ref="postMoney"/>
							</td>
						</tr>
						<tr>
							<td>结束时间</td>
							<td className="projectEndTime">
								<input type="text" ref="endTimes" placeholder="如2012-12-12 12:80:30，如不设，请勿填" value={this.state.information.endTime} onChange={this.postEndTime.bind(this)}/>
							</td>
						</tr>
						<tr>
							<td>联系人</td>
							<td>
								<input type="text" value={this.state.information.liable} onChange={this.postLiable.bind(this)} ref="postLiable"/>
							</td>
						</tr>
						<tr>
							<td>联系电话</td>
							<td>
								<input type="text" value={this.state.information.mobile} onChange={this.postTel.bind(this)} ref="postTel"/>
							</td>
						</tr>
						{/*<tr>
							<td>项目进展</td>
							<td ref="progress" style={{cursor:"pointer"}} onClick={this.showProjectProgressList.bind(this)} style={{cursor:"pointer"}}>新增项目进展</td>
						</tr>*/}
						<tr>
							<td>捐款人数</td>
							<td>{this.state.information.people}人</td>
						</tr>
						<tr>
							<td>上传图片</td>
							<td ref="cover">
								<div className="ProjectUploadImg" style={{marginLeft:'0'}}>
									<div className="uploadImgBtn" id="projectCompileImg">点击上传封面图</div>
									<div id="projectUpLoadCompile" className="uploadImgContainer">
										<img src={this.state.information.cover} alt=""/>
									</div>
									<div className="uploadImgStatement">
										<img src="./img/imgStatement.png" alt=""/>
										(图片尺寸750x360 支持jpg/png)
									</div>
									<div id="projectCoPro" className="progressLine"></div>
								</div>
								<div className="ProjectUploadImg" style={{marginLeft:'0'}}>
									<div className="uploadImgBtn" id="projectCompileShowImg">点击上传列表展示图</div>
									<div id="projectCompileShow" className="uploadImgContainer1">
										<img src={this.state.information.thumb} alt=""/>
									</div>
									<div className="uploadImgStatement uploadImgStatement1">
										<img src="./img/imgStatement.png" alt=""/>
										(图片尺寸200x160 ,支持jpg/png)
									</div>
									<div id="isCompileShowImg" className="progressLine progressLine1"></div>
								</div>
							</td>
						</tr>
						{/*<tr>
							<td>爱心互动</td>
							<td>查看</td>
						</tr>*/}
						</tbody>
					</table>
					<table className="projectRouteTable tableTwo">
						<tbody>
						<tr>
							<td>项目书</td>
							<td ref="project_book" onClick={this.projectBookView.bind(this)} style={{'textDecoration':'underline','cursor':'pointer'}}>查看</td>
						</tr>
						<tr>
							<td>项目状态</td>
							<td>
								<select name="projectState" id="" ref="projectState" onChange ={this.postProjectState.bind(this)}>
									<option value="0">募捐中</option>
									<option value="1">执行中</option>
									<option value="2">已结束</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>项目地址</td>
							<td>
								<select name="" id="province1" >

								</select>
								<select name="" id="city1"  style={{marginLeft:"2%"}} >

								</select>
							</td>
						</tr>
						<tr>
							<td>项目执行地</td>
							<td>
								<input type="text" placeholder="项目执行详细地址" value={this.state.information.location} onChange={this.postLocation.bind(this)} ref="postLocation"/>
							</td>
						</tr>
						<tr>
							<td>项目捐款方式</td>
							<td>
								<select ref="postDonate" onChange={this.postDonate.bind(this)}>
									<option value="0">单次</option>
									<option value="1">日捐</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>项目简介</td>
							<td><input type="text" ref="description" placeholder="项目简介（20字以内）" value={this.state.information.description} onChange={this.postDescription.bind(this)}/></td>
						</tr>
						<tr>
							<td>已捐金额</td>
							<td>{this.state.information.getMoney}元</td>
						</tr>
						<tr>
							<td>未捐金额</td>
							<td>{this.state.information.notMoney}元</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className="projectIntroduce">
					<p className="introduceTitle">项目介绍：</p>
					<div ref='content' id="UEditorProjectCompile" ></div>
				</div>
				<div className="btnBox" style={{width:'50%',margin:'20px auto',height:'36px',}}>
					<div onClick={this.previewProject.bind(this)}>预览</div>
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
			$('#coverBox,.projectPreviewContainer').hide();
			$('#coverBox').css('background','rgba(51,51,51,0.3)')
		})
		let cityList = city().citylist
		$.each(cityList,function(index,item){
			$("#province1").append("<option value='"+index+"'>"+item.p+"</option>")
		})
		$.each(cityList[0].c,function(index,item){
			$("#city1").append("<option  value='"+item.n+"'>"+item.n+"</option>")
		})
		$("#province1").on("change",function(event){
			let index = $(this).val()
			$("#city1").html("");
			$.each(cityList[index].c,function(index,item){
				$("#city1").append("<option value='"+item.n+"'>"+item.n+"</option>")
			})
		})
		uploadImage("projectCompileImg","projectCoPro",this,2,'projectUpLoadCompile');
		uploadImage("projectCompileShowImg","isCompileShowImg",this,2,'projectCompileShow');
		this.getProjectType();
		this.setUEditorProjectCompile();
	}
	setUEditorProjectCompile(){
		UE.delEditor('UEditorProjectCompile',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		})
		window.projectEditor = UE.getEditor('UEditorProjectCompile',{
			toolbars:[['fullscreen','bold','italic','underline','insertorderedlist','insertunorderedlist','insertimage','link']]
		})
	}
	//返回列表页
	backList(){
		$("#projectList").show().siblings().hide();
		$(".checkAll").siblings().removeClass("hideItems");
		$("#compile").addClass("hideItems");
		this.props.callbackParent(0);
		$("#projectCoPro,#isCompileShowImg").html('');
	}
	//返回详情页
	backProjectDetail(){
		$("#projectInfo").show().siblings().hide();
		$("#compile").removeClass("hideItems")
	}
	//请求修改当前信息
	getInformation(projectId){
		let that = this;
		let cityList = city().citylist
		sendAjax({
			type:"POST",
			url:"admin/project/findProject",
			data:{
				token:token,
				projectId:projectId
			},
			success:function(data){
				if(data.code == 200){
					if(data.message.endTime=='2038-01-10 00:00:00'){
						data.message.endTime = '不设期限';
					}
					if(data.message.money==0.00){
						data.message.money = '不设目标';
					}
					let province =data.message.province;
					let city = data.message.city;
					let type = data.message.type;
					let typeList = $(that.refs.type).find("option");
					let grade = data.message.grade;
					let orderTime = data.message.endTime.substr(0,10).split("-");
					$('#projectUpLoadCompile').html('<img src="'+data.message.cover+'" />');
					$('#projectCompileShow').html('<img src="'+data.message.thumb+'" />');
					$('#projectCoPro,#isCompileShowImg').html('');
					orderTime = orderTime[0]+"-"+Number(orderTime[1])+"-"+Number(orderTime[2]);
					$("#otherCalendarContainer1").find(".datePicked").text(orderTime);
					$(that.refs.projectState).val(data.message.projectState);
					$(that.refs.postGrade).val(grade);
					$(that.refs.postDonate).val(data.message.donation);
					$("#bannerBrowse").html('<img src="'+data.message.cover+'" />');
					$("#bannerPost").html('');
					projectEditor.setContent(data.message.content);
					$.each(typeList,function(index,item){
						if($(item).text()==type){
							$(item).attr("selected","selected");
						}
					})
					let i = 0;
					let provinceList = $("#province1").find("option");
					$.each(provinceList,function(index,item){
						$(item).attr('selected',false);
						if($(item).text()==province){
							$(item).attr("selected","selected");
							i = index;
						}
					})
					$("#city1").html("");
					$.each(cityList[i].c,function(index,item){
						$("#city1").append("<option  value='"+item.n+"'>"+item.n+"</option>")
					})
					$('#projectType').val(data.message.projectType);
					$("#city1").val(city)
					that.setState({
						'information':data.message,
					},function(){
						that.setState({
							'information':update(that.state.information,{'projectId':{$set:that.refs.type.getAttribute('data-typeId')}})
						})
						that.setState({
							'information':update(that.state.information,{$merge:{'token':token}})
						})
					})
				}
			}
		})
	}
	//请求项目类别
	getProjectType(){
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
				})
			}
		})
	}
	//项目预览
	previewProject(){
		this.state.information.projectTypeText=$(this.refs.type).find('option:selected').text();
		let content = projectEditor.getContent();
		this.state.information.content = content;
		this.setState({
			'previewInformation':this.state.information
		},function(){
			document.body.scrollTop = 0;
			$('#coverBox').css({
				'height':document.body.scrollHeight+'px',
				background:'#000'
			}).show();
			$('.projectPreviewContainer').show();
		})
	}
	postTitle(e){
		let newData = update(this.state.information,{'title':{$set:this.refs.title.value}});
		this.setState({
			'information':newData
		})
	}
	postType(){
		let newData = update(this.state.information,{'projectType':{$set:this.refs.type.value}});
		this.setState({
			'information':newData
		})
	}
	postMatchRatio(){
		let newData = update(this.state.information,{'match_ratio':{$set:this.refs.matchRatio.value}});
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
	postOrg(){
		let newData = update(this.state.information,{'name':{$set:this.refs.postOrg.value}});
		this.setState({
			'information':newData
		})
	}
	postMoney(){
		let money = this.refs.postMoney.value;
		if(money==''){
			money = 0;
		}
		let newData = update(this.state.information,{'money':{$set:money}});
		this.setState({
			'information':newData
		})
	}
	postTime(){
		let newData = update(this.state.information,{'end_time':{$set:this.refs.postTime.value}});
		this.setState({
			'information':newData
		})
	}
	postLiable(){
		let newData = update(this.state.information,{'liable':{$set:this.refs.postLiable.value}});
		this.setState({
			'information':newData
		})
	}
	postEndTime(){
		let endTime = this.refs.endTimes.value;
		if(endTime==""){
			endTime = ''
		}
		let newData = update(this.state.information,{'endTime':{$set:endTime}});
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
	postDistrict(){
		let newData = update(this.state.information,{'district':{$set:this.refs.postDistrict.value}});
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
	postDonate(){
		let newData = update(this.state.information,{'donation':{$set:this.refs.postDonate.value}});
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
	postOperate(e){
		let that = this;
		$(e.target).css({
			'background':'#e7503d',
			'color': '#fff',
			'border':'0'
		}).siblings('span').css({
			'background':'#fff',
			'color':'#000',
			'border':'1px solid #000'
		});
		let status = +$(e.target).attr('data-operate');
		let newData = update(this.state.information,{'operate':{$set:status}})
		//提交operate没问题
		this.setState({
			'information':newData
		})
	}
	savePage(){
		let that = this;
		//样式改变
		let information = that.state.information;
		let title = information.title;
		if(title == ''){
			alert('请输入项目名称');
			return
		}else if(title.length>10){
			alert('项目名称10字以内');
			return
		}
		let money = information.money;
		if(money==''){
			information.money = 0
		}else if(money>1000000000){
			alert('筹款目标不能大于10亿');
			return
		}
		let location = information.location;
		if(location == ''){
			alert('请输入详细地址');
			return
		}else if(location.length>30){
			alert('详细地址不能超过30字');
			return
		}
		let liable = information.liable;
		if(liable == ''){
			alert('请输入联系人');
			return
		}else if(liable.length>10 || liable.length<2){
			alert("联系人2-10字以内");
			return;
		}
		let mobile = information.mobile;
		if(mobile == ''){
			alert('请输入电话号码');
			return
		}else if(!isMobile(mobile)){
			alert("电话号码不符合规则！");
			return;
		}
		let contentTxt = projectEditor.getContentTxt();
		let content = projectEditor.getContent();
		if(content==""){
			alert("项目介绍不能为空！");
			return;
		}
		let description = information.description;
		if(isVal(description)==""){
			alert("项目简介不能为空！");
			return;
		}else if(description.length>20){
			alert("项目简介20字以内！");
			return;
		}
		let cover = information.cover;
		if(isVal(this.state.cover)!=''){
			cover = this.state.cover;
		}
		let thumb = information.thumb;
		if(isVal(this.state.projectCompileShowImg)!=''){
			information.thumb = this.state.projectCompileShowImg;
		}
		let province = $("#province1").find("option:selected").text();
		let city = $("#city1").val();
		information.province = province;
		information.city = city;
		if(information.endTime==''){
			information.endTime = '2038-01-10';
		}
		information.projectId = information.id;
		information.content = content;
		information.cover = cover;
		if(information.endTime==''||information.endTime=='2038-01-10'||information.endTime=='不设期限'){
			information.endTime='2038-01-10'
		}
		if(information.money==''||information.money=='0.00'||information.momey=='不设目标'){
			information.money = 0;
		}
		if(isVal(this.props.projectBook)!=""){
			information.projectBook = this.props.projectBook;
		}
		//提交的information没问题
		sendAjax({
			type:"POST",
			url:"admin/project/editProject",
			data:information,
			success:function(data){
				if(data.code == 200){
					alert('保存成功！');
					window.location.reload();
					that.props.callbackParent(0);
					$('#projectList').css('display','block').siblings().css('display','none');
					$('#addNewContainer').remove();
					$('.checkAll').css('overflow','visible').siblings().removeClass('hideItems');
					$("#compile").addClass("hideItems");
					$('.activeItemsCheckGather').css('background',"#e7503d url('img/arrow_down.jpg') no-repeat 96% center").siblings().addClass('hideItems');
					$('.operationBar').css('overflow','visible');
				}else if(data.code==206&&data.message=='The start end is not a valid date.'){
					alert('结束时间格式不正确，请重新输入(正确格式如:2012-12-12)');
				}else{
					alert(data.message)
				}
			}
		})
	}
	projectBookView(){
		this.props.projectBookStatusBack('compile');
		$('#projectBook').css('display','block').siblings().css('display','none');
	}
	showProjectProgressList(){
		$('#projectProgressList').css('display','block').siblings().css('display','none');
	}
}