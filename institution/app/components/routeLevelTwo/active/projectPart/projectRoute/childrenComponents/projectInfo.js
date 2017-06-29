import React from 'react';
import QRCode from 'qrcode.react';
import {sendAjax} from '../../../../../../../lib/commonEvent';

let token = sessionStorage.getItem('token');
export default class ProjectInfo extends React.Component{
	constructor(){
		super()
		this.state = {
			'information':{},
			previewUrl:'http://www.fojiaosiyuan.com/projectDetail.html'
			//previewUrl:'http://walq.lingshanfoundation.org/projectDetail.html'
		}
	}
	render(){
		return(
			<div id="projectInfo" style={this.props.hideStyle}>
				<div className="backBtn">
					<span onClick={this.backList.bind(this)}>募捐项目</span>
					<span className="noChange">></span>
					<span>项目详情</span>
				</div>
				<div className="tableContainer">
					<table className="projectRouteTable tableOne">
						<tbody>
						<tr>
							<td>项目名称</td>
							<td>{this.state.information.title}</td>
						</tr>
						<tr>
							<td>项目类别</td>
							<td>{this.state.information.type}</td>
						</tr>
						<tr>
							<td>配捐比例</td>
							<td>{this.state.information.matchRatio?this.state.information.matchRatio:'无'}</td>
						</tr>
						<tr>
							<td>配捐企业</td>
							<td>{this.state.information.matchFirm==""?"无":this.state.information.matchFirm==1?'灵山慈善基金会':this.state.information.matchFirm}</td>
						</tr>
						<tr>
							<td>筹款目标</td>
							<td>{this.state.information.money}</td>
						</tr>
						<tr>
							<td>结束时间</td>
							<td>{this.state.information.endTime}</td>
						</tr>
						<tr>
							<td>联系人</td>
							<td>{this.state.information.liable}</td>
						</tr>
						<tr>
							<td>联系电话</td>
							<td>{this.state.information.mobile}</td>
						</tr>
						<tr>
							<td>已捐金额</td>
							<td>{this.state.information.getMoney}元 <span className="underLine cursorPointer" onClick={this.showDonateMoneyList.bind(this)}>查看</span></td>
						</tr>
						<tr>
							<td>未捐金额</td>
							<td>{this.state.information.notMoney}元</td>
						</tr>
						<tr>
							<td>配捐金额</td>
							<td>{this.state.information.donationMoney?this.state.information.donationMoney:'0.00'}元</td>
						</tr>
						<tr>
							<td>配捐上限</td>
							<td>{this.state.information.matchMoney?this.state.information.matchMoney:'0.00'}元</td>
						</tr>
						</tbody>
					</table>
					<table className="projectRouteTable tableTwo">
						<tbody>
						<tr>
							<td>项目书</td>
							<td>
								<a onClick={this.showProjectBook.bind(this)} className="cursorPointer underLine">查看</a>
							</td>
						</tr>
						<tr>
							<td>项目状态</td>
							<td>{this.state.information.projectState == 2?"已结束":this.state.information.projectState == 1?"执行中":"募捐中"}</td>
						</tr>
						<tr>
							<td>项目执行地</td>
							<td>{this.state.information.province}{this.state.information.city} {this.state.information.district} {this.state.information.location}
							</td>
						</tr>
						<tr>
							<td>项目捐款方式</td>
							<td>{this.state.information.donation == 1?'日捐':'单次'}</td>
						</tr>
						<tr>
							<td>封面banner</td>
							<td>
								<a href={this.state.information.cover} className="underLine" target="_blank" style={{color:"#999"}}>
									查看
								</a>
							</td>
						</tr>
						<tr>
							<td>列表展示图</td>
							<td>
								<a href={this.state.information.thumb?this.state.information.thumb:'javascript:;'} className="underLine" target="_blank" style={{color:"#999"}}>
									{this.state.information.thumb?"查看":'未上传'}
								</a>
							</td>
						</tr>
						{/*<tr>
							<td>爱心互动</td>
							<td>爱心互动</td>
						</tr>*/}
						<tr>
							<td>捐款人数</td>
							<td>{this.state.information.people}人</td>
						</tr>
						<tr>
							<td>关注人数</td>
							<td>{this.state.information.attention}人</td>
						</tr>
						<tr>
							<td>项目进展</td>
							<td onClick={this.showProjectProgressList.bind(this,this.state.information.status)} style={{cursor:"pointer"}} className="underLine">查看项目进展</td>
						</tr>
						<tr>
							<td>项目简介</td>
							<td>{this.state.information.description}</td>
						</tr>
						{/*<tr>
							<td>已提取金额</td>
							<td>{this.state.information.getMoney}</td>
						</tr>
						<tr>
							<td>未提取金额</td>
							<td>{this.state.information.notMoney}</td>
						</tr>*/}
						<tr>
							<td>二维码</td>
							<td>
								<QRCode value={this.state.previewUrl} />
							</td>
						</tr>
						</tbody>
					</table>
				</div>
				<div className="projectIntroduce">
					<div className="introduceTitle">项目介绍：</div>
					<div id="projectContentDetails" className="introduceContents"></div>
				</div>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		this.getInformation(nextProps.status);
	}
	backList(){
		$("#projectList").show().siblings().hide();
		$(".checkAll").siblings().removeClass("hideItems");
		$("#compile").addClass("hideItems");
		this.props.callbackParent(0);
	}
	getInformation(projectId){
		let that = this;
		if(!projectId){
			return false;
		}
		//获取项目详情
		sendAjax({
			type:"POST",
			url:"admin/project/findProject",
			data:{
				token:token,
				projectId:projectId
			},
			success:function(data){
				if(data.code == 200){
					//data.message.endTime = data.message.endTime.substr(0,10);
					if(data.message.grade==3){
						data.message.grade = "高级";
					}else if(data.message.grade==2){
						data.message.grade="中级";
					}else if(data.message.grade==1){
						data.message.grade="低级";
					}
					if(data.message.endTime=='2038-01-10' || data.message.endTime=='2038-01-10 00:00:00'){
						data.message.endTime='不设期限';
					}
					if(data.message.money=='0.00'){
						data.message.money='不设目标';
					}
					that.setState({
						'information':data.message,
						//previewUrl:'http://www.fojiaosiyuan.com/projectDetail.html?projectId='+data.message.id+'&groupId='+data.message.groupId+'&status='+data.message.status
						previewUrl:'http://walq.lingshanfoundation.org/projectDetail.html?projectId='+data.message.id+'&groupId='+data.message.groupId+'&status='+data.status
					},function(){
						document.getElementById('projectContentDetails').innerHTML = that.state.information.content
					});
				}
			}
		})
	}
	showProjectBook(){
		this.props.projectBookStatusBack('info');
		$('#projectBook').css('display','block').siblings().css('display','none');
	}
	showProjectProgressList(state){
		if(state==2){
			alert('项目未通过，不能添加项目进展！');
			return
		}else if(state==0){
			alert('项目待审核，不能添加项目进展！');
			return;
		}
		$('#projectProgressList').css('display','block').siblings().css('display','none');
		$("#compile").addClass("hideItems");
	}
	showDonateMoneyList(){
		$("#donateMoneyList").show().siblings().hide();
		$(".checkAll").siblings().addClass("hideItems");
		$("#increase").addClass("hideItems");
		$("#compile").addClass("hideItems");
	}
}
