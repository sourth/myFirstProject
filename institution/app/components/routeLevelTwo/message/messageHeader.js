import React from 'react';
import {Link} from 'react-router';
import {sendAjax,isVal} from '../../../../lib/commonEvent';
import './message.less';
export default class MessageHeader extends React.Component{
	render(){
		let status = this.props.status;
		return(
			<div id="messageHeader" style={{'padding':'0 2%',position:'relative'}}>
				<div id="deleteMessageBox">
					<div id="isDeleteMessage">
						<p>删除后无法找回</p>
						<p>请慎重操作</p>
					</div>
					<div id="isSure">
						<span id="isOk" onClick={this.deleteThisOne.bind(this)}>确定</span>
						<span onClick={this.cancelDelete.bind(this)}>取消</span>
					</div>
				</div>
				<div className="operationBar" >
					<div id="messageTitle" style={{display:status==0?'block':'none'}}>消息推送</div>
					<div className="checkAll messageRouteContainer" style={{display:status==0?'none':'block'}} ref="messageRouteContainer">
						<div  className="activeItemsCheckGather titleBackground"  onClick={this.checkToggle.bind(this) } >活动消息推送</div>
						<ul className="hideItems" onClick={this.changeItems.bind(this)} style={{zIndex:'10'}}>
							<Link to="/message/actMessage" ><li onClick={this.props.changeStyle.bind(this,2)}>活动消息推送</li></Link>
							<Link to="/message/messageGather" onClick={this.props.changeStyle.bind(this,3)}><li>项目消息推送</li></Link>
						</ul>
					</div>
					<form style={{'margin':'0 5% 0 30%'}}>
						<input type="text" placeholder="请输入关键字" className="keyWords" ref="keyWords"/>
						<h2 className="search">
							<img src="img/search.jpg" onClick = {this.props.searchProject}/>
						</h2>
					</form>
					<div id="delete" className="delete messageOperation" ref="messageDelete" style={{'marginRight':'2%',display:status==0?'block':'none'}} onClick={this.deletedMessage.bind(this)}>删除</div>
					<div id="compile" className="compile messageOperation" ref="messageSend" style={{display:status==0?'block':'none'}} onClick={this.showRoute.bind(this)}>推送消息</div>
					<p className="clearFloat"></p>
				</div>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){

	}
	componentDidMount(){


	}
	showRoute(){
		window.location.hash = '#/message/actMessage';
		this.props.changeStyle(1)
	}
	checkToggle(e){
		e.nativeEvent.stopImmediatePropagation();
		$('.activeItemsCheckGather').siblings('ul').toggleClass('hideItems');
	}
	changeItems(e){
		$('.activeItemsCheckGather').html($(e.target).text());
	}
	//弹出删除框
	deletedMessage(){
		let id = this.props.deleteId;
		if(isVal(id)==""){
			alert("请选择一个项目或活动！");
			return;
		}
		$('#coverBox').css({
			'height':document.body.scrollHeight+'px'
		}).show();
		$("#deleteMessageBox").show();
	}
	//取消删除框
	cancelDelete(){
		$('#coverBox').hide();
		$("#deleteMessageBox").hide();
	}
	//确定删除账号
	deleteThisOne(){
		let token = sessionStorage.getItem('token');
		$('#coverBox').hide();
		$("#deleteMessageBox").hide();
		let id = this.props.deleteId;
		sendAjax({
			type:'POST',
			url:'admin/message/deleteMessage',
			data:{
				token:token,
				id:id
			},
			success:function(data){
				if(data.code==200){
					alert("删除成功！");
					window.location.reload()
				}
			}
		})
	}
}
