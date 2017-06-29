import React from 'react';
import update from 'react-addons-update';
import {sendAjax,isVal,getPageArray} from '../../../../lib/commonEvent';
export default class ActMessage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[],
			'checkStatus':[],
			'id':0,
			'pageNumber':[],
			'pageNow':'',
			pageAll:1,
			itemId:'',
			method:1,
			messageModel:"您好，短信模版为：【为爱行走】您好！感谢您报名参加#活动名称#。#内容#                                           " +
			"你只用输入“内容”这部分文字即可；                                                             " +
			"例如：【为爱行走】您好！感谢您报名参加为爱行走-无锡站6KM。时间：2017年5月20日8:30签到，12:00结束。地点：桂林市中心广场。您只需要输入：时间：2017年5月20日8:30签到，12:00结束。地点：桂林市中心广场。"
		}
	}
	render(){
		return (
			<div id="actMessage" style={{position:"relative",height:'1000px',boxSizing:'border-box',padding:'0 2%'}}>
				<div className="backBtn"  style={{marginLeft:'4%'}}>
					<a href="#/message" onClick={this.backList.bind(this)}>消息推送列表</a>
					<span className="noChange">></span>
					<span>活动消息推送</span>
				</div>
				<table className="checkedList" cellSpacing = '0'>
					<thead>
					<tr>
						<th>
							{/*<input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>*/}
						</th>
						<th>排序</th>
						<th>开始时间/结束时间</th>
						<th>活动名称</th>
						<th>活动状态</th>
						<th>活动总人数</th>
						<th>报名费用</th>
						{/*<th>查看详情</th>*/}
					</tr>
					</thead>
					<tbody>
					{
						this.state.items.map(function(item,index){
							return (
								<tr key={index}>
									<td>
										<input type="checkbox" className="tick" onClick={this.tickOrNot.bind(this,item.id)} data-id={item.id}/>
									</td>
									<td>{index+1}</td>
									<td>{item.duringTime}</td>
									<td>{item.title}</td>
									<td>{item.activityState}</td>
									<td>{item.number}</td>
									<td>{item.charge=="0.00"?"免费":item.charge}</td>
									{/*<td className="statusInformation" onClick={this.check.bind(this)} data-id={item.id} data-status={item.status}>查看</td>*/}
								</tr>
							)
						}.bind(this))
					}
					</tbody>
				</table>
				<div className="pageList">
					<div className="firstAndLast" onClick={this.jumpToFirst.bind(this)}>首页</div>
					<div className="pageContainer">
						<ul>
							{
								this.state.pageNumber.map(function(item,index){
									return(
										<li key={index}  onClick={this.changePage.bind(this,(item.pageNo-1))} data-flag={item.pageNo-1}>{item.pageName}</li>
									)
								}.bind(this))
							}
						</ul>
					</div>
					<div className="firstAndLast" onClick={this.jumpToLast.bind(this)}>尾页</div>
					<div className="pageCount">
						<span>第{this.state.pageNow == ''?1:this.state.pageNow}页</span>/
						<span>共{this.state.pageAll}页</span>
					</div>
					<div className="jumpTo">
						<input type='number' ref="jumpToPages" min="1"/>
						<span onClick={this.jumpToPages.bind(this)}>跳转</span>
					</div>
				</div>
				<div className="sendProjectMessage sendMessages">
					<div className="sendMessageBox">
						<h3>推送</h3>
						<div>
							<span onClick={this.choseSendMethod.bind(this,1)}>短信</span>
							<span onClick={this.choseSendMethod.bind(this,2)}>邮件</span>
							<span onClick={this.choseSendMethod.bind(this,3)}>微信</span>
						</div>
						<textarea placeholder={this.state.messageModel} ref="messageContent" style={{'resize':'none','fontSize':'1.8em','width':'60%','height':'200px'}}>

						</textarea>
					</div>
					<a href="javascript:;" className="messageSend" onClick={this.sendMessage.bind(this)}>
						发布推送
					</a>
				</div>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.status!=0){
			this.getInformation(0,nextProps.keyWord);
		}
	}
	componentDidMount(){
		this.getInformation(0,'');
	}
	//返回列表页
	backList(){
		$('#messageTitle').removeClass('hideItems');
		this.props.changeStyle.bind(0)
	}
	choseSendMethod(method,event){
		event = event || window.event;
		let target = event.target;
		if(method==1){
			this.setState({
				messageModel:"您好，短信模版为：【为爱行走】您好！感谢您报名参加#活动名称#。#内容#                                           " +
				"你只用输入“内容”这部分文字即可；                                                             " +
				"例如：【为爱行走】您好！感谢您报名参加为爱行走-无锡站6KM。时间：2017年5月20日8:30签到，12:00结束。地点：桂林市中心广场。您只需要输入：时间：2017年5月20日8:30签到，12:00结束。地点：桂林市中心广场。"
			})
		}else{
			this.setState({
				messageModel:'请输入发布内容。'
			})
		}
		this.setState({
			method:method
		},function(){
			$(target).css({
				color:"#e6503c",
				border:"solid 1px #e6503c",
				background:'url(img/sendW.png) no-repeat  top right',
				backgroundSize:'30%'
			}).siblings().css({
				color:"#666",
				border:"solid 1px #999",
				background:'none'
			})
		})
	}
	sendMessage(){
		let token = sessionStorage.getItem('token');
		if(this.state.pageAll==0){
			alert('暂无线下活动');
			return;
		}
		let sendData = {};
		sendData.token = token;
		sendData.method = this.state.method;
		if(isVal(this.refs.messageContent.value)==""){
			alert("推送消息不能为空！");
			return;
		}
		sendData.message = this.refs.messageContent.value;
		sendData.item_type = 2;
		sendData.item_id = this.state.itemId;
		if(isVal(this.state.itemId)==''){
			alert("请选择一个活动！");
			return;
		}
		sendAjax({
			type:'POST',
			url:'admin/message/addMessage',
			data:sendData,
			success:function(data){
				if(data.code==200){
					alert("推送消息成功！");
					window.location.href='#/message'
				}else{
					alert(data.message);
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
	getInformation(page,title){
		let token = sessionStorage.getItem('token');
		page = page || 0;
		title = title || '';
		let that = this;
		sendAjax({
			type:"POST",
			url:"admin/activity/findActivityList",
			data:{
				token:token,
				page:page,
				search:title
			},
			success:function(data){
				if(data.code==200){
					let list = data.activityList;
					let nowDate = new Date();
					let nowDateMs = new Date(nowDate).getTime();
					$.each(list,function(index,item){
						let startTime =item.start_time.substr(0,10);
						let startTimeMs = new Date(item.start_time.replace(/-/g, "/")).getTime()
						let endTime = item.end_time.substr(0,10);
						let endTimeMs = new Date(item.end_time.replace(/-/g, "/")).getTime();
						let duringTime = startTime+"/"+endTime;
						item.duringTime = duringTime;
						let status = item.status;
						if(status==0){
							item.activityState="待审核";
						}else if(status==2){
							item.activityState="未通过";
						}else if(status==1){
							if(startTimeMs>nowDateMs){
								item.activityState="报名中";
							}else if(startTimeMs<=nowDateMs&&nowDateMs<=endTimeMs){
								item.activityState="进行中";
							}else if(nowDateMs>endTimeMs){
								item.activityState="活动结束";
							}
						}
					})
					if(data.pageAll==0){
						that.setState({
							pageNow:"0"
						})
					}
					let newArray = getPageArray(page+1,data.pageAll,10);
					that.setState({
						items:list
					},function(){
						that.setState({
							pageNumber:newArray,
							pageAll:data.pageAll
						},function(){
							$.each($('.pageContainer').find('li'),function(index,item){
								if($(item).attr('data-flag')==page){
									$(item).css({'background':'#e7503d','color':'#fff'});
									that.setState({
										pageNow:Number(page+1)
									})
								}
							})
						})
					})
				}
			}
		})
	}
	changeStyle(e){
		let status = e.target.checked;
		$('.tick').each(function(){
			this.checked = status
		})
	}
	tickOrNot(itemId,event){
		event = event || window.event;
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		if(event.target==true){
			event.target.checked = false;
		}else{
			event.target.checked = true;
		}
		this.setState({
			itemId:itemId
		})
	}
	changePage(page,e){
		if(page<0){
			return;
		}
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		//获取数据
		this.getInformation(page,this.props.projectTitle);
		this.setState({
			itemId:'',
			pageNow:page+1
		})
	}
	jumpToFirst(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		this.getInformation(0,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		if(this.state.pageAll!=0){
			this.setState({
				itemId:'',
				pageNow:1
			})
		}
	}
	jumpToLast(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		this.getInformation(this.state.pageAll-1,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		this.setState({
			itemId:'',
			pageNow:this.state.pageAll
		})
	}
	jumpToPages(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		let page = this.refs.jumpToPages.value;
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		if(page!=''){
			if(page>0&&page<=this.state.pageAll){
				this.getInformation(page-1,this.props.projectTitle);
				this.setState({
					itemId:'',
					pageNow:page
				})
			}
		}
	}
}