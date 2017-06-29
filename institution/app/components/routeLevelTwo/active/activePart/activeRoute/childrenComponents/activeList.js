import React from 'react';
import update from 'react-addons-update';
import {uploadImage} from '../../../../../../../lib/upload';
import {sendAjax,getPageArray} from '../../../../../../../lib/commonEvent';
import {city} from '../../../../../../../lib/city';
let token = sessionStorage.getItem('token');
export default class ActiveList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[],
			'checkStatus':[],
			'id':0,
			'pageNumber':[],
			'pageNow':0,
			pageAll:1
		}
	}
	render(){
		return (
			<div id="activeList" style={{position:"relative"}}>
				<table className="checkedList" cellSpacing = '0'>
					<thead>
					<tr>
						{/*<th>
							<input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>
						</th>*/}
						<th>排序</th>
						<th>报名截止时间/活动举行时间</th>
						<th>活动名称</th>
						<th>活动状态</th>
						<th>活动总人数</th>
						<th>报名费用</th>
						<th>查看详情</th>
					</tr>
					</thead>
					<tbody>
					{
						this.state.items.map(function(item,index){
							return (
								<tr key={index}>
									{/*<td>
										<input type="checkbox" className="tick" onClick={this.tickOrNot.bind(this)} data-id={item.id}/>
									</td>*/}
									<td>{index+1}</td>
									<td>{item.duringTime}</td>
									<td>{item.title}</td>
									<td>{item.activityState}</td>
									<td>{item.number}</td>
									<td>{item.charge=="0.00"?"免费":item.charge}</td>
									<td className="statusInformation" onClick={this.check.bind(this)} data-id={item.id} data-status={item.status}>查看</td>
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
						<span>第{this.state.pageNow}页</span>/
						<span>共{this.state.pageAll}页</span>
					</div>
					<div className="jumpTo">
						<input type='number' ref="jumpToPages" min="1"/>
						<span onClick={this.jumpToPages.bind(this)}>跳转</span>
					</div>
				</div>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.projectTitle!=''|| nextProps.status==0){
			this.getInformation(0,nextProps.projectTitle);
		}
	}
	componentDidMount(){
		this.getInformation(0);
		//document.onkeydown = function(event){
		//	var e = event || window.event || arguments.callee.caller.arguments[0];
		//	if(e&&e.keyCode==13){
		//		alert(111)
		//		self.getInformation(0,$('.keyWords').val());
		//	}
		//}
		$('.pageContainer').find('li').eq(0).css({'background':'#e7503d','color':'#fff'})
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
								item.activityState="已结束";
							}
						}
					})
					let newArray = getPageArray(page+1,data.pageAll,10);
					if(data.pageAll==0){
						that.setState({
							pageNow:0
						})
					}
					that.setState({
						items:list
					},function(){
						that.setState({
							pageNumber:newArray,
							pageAll:data.pageAll
						},function(){
							$.each($('.pageContainer').find('li'),function(index,item){
								$(item).css({'background':'#fff','color':'#000'});
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
	tickOrNot(e){
		let count = 0;
		$('.tick').each(function(index,el){
			if($(el).is(':checked')){
				return;
			}else{
				count++
			}
		});
		if($('.tick').length == count){
			$('#tickAll')[0].checked = false;
		};
	}
	changeHeaderStyle(){
		$('.itemsCheckGather').css('background','#e7503d');
		$('.checkAll').siblings().addClass('hideItems');
		$("#compile").removeClass("hideItems")
		$('.checkAll').children('ul').addClass('hideItems');
	}
	check(e){
		let that = this;
		$('.keyWords').val('');
		let token = sessionStorage.getItem('token');
		let id = $(e.target).attr('data-id');
		$('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
		$('.operationBar').css('overflow','hidden');
		$('.itemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
		$('#activeInfo').css('display','block').siblings().css('display','none');
		this.changeHeaderStyle();
		this.props.callbackParent(id);
		this.props.postActivityId(id);
		this.props.isIndex(2)
	}
	changePage(page,e){
		if(page<0){
			return;
		}
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		//获取数据
		this.getInformation(page,this.props.projectTitle);
		this.setState({
			pageNow:page+1
		})
	}
	jumpToFirst(){
		this.getInformation(0,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		if(this.state.pageAll!=0){
			this.setState({
				pageNow:1
			})
		}
	}
	jumpToLast(){
		this.getInformation(this.state.pageAll-1,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		this.setState({
			pageNow:this.state.pageAll
		})
	}
	jumpToPages(){
		let page = this.refs.jumpToPages.value;
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		if(page!=''){
			if(page>0&&page<=this.state.pageAll){
				this.getInformation(page-1,this.props.projectTitle);
				this.setState({
					pageNow:page
				})
			}
		}
	}
}