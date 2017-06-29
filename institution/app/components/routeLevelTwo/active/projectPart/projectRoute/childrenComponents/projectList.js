import React from 'react';
import {sendAjax,getPageArray} from '../../../../../../../lib/commonEvent';


let token = sessionStorage.getItem("token");
export default class ProjectList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[],
			'checkStatus':[],
			'id':0,
			'pageNumber':[],
			'pageNow':'',
			pageAll:1,
			pageArray:[]
		}
	}
	render(){
		return (
			<div id="projectList" style={{position:"relative"}}>
				<table className="checkedList" cellSpacing = '0'>
					<thead>
						<tr>
							{/*<th>
								<input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>
							</th>*/}
							<th>排序</th>
							<th>项目名称</th>
							<th>捐款方式</th>
							<th>项目类型</th>
							<th>项目状态</th>
							<th>审核状态</th>
							<th>查看详情</th>
						</tr>
					</thead>
					<tbody>
					{
						this.state.items.map(function(item,index){
							return (
								<tr key={index}>
									{/*<td>
										<input type="checkbox" className="tick" onClick={this.tickOrNot.bind(this)}/>
									</td>*/}
									<td>{index+1}</td>
									<td>{item.title}</td>
									<td>{item.donation == 1?'日捐':'单次'}</td>
									<td>{item.type}</td>
									<td>{item.projectState==2?"已结束":item.projectState==1?"执行中":"募捐中"}</td>
									<td>{item.status==2?'未通过':item.status==1?'通过':'待审核'}</td>
									<td className="statusInformation" onClick={this.check.bind(this)} data-groupId={item.id} data-status={item.status}>查看</td>
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
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.projectTitle!='' || nextProps.status==0){
			this.getInformation(0,nextProps.projectTitle);
		}
	}
	componentDidMount(){
		this.getInformation(0);
		let self = this;
		$('.tick').each(function(index,el) {
			$(this).attr('index',index)
		});
		document.onkeydown = function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e&&e.keyCode==13){
				//阻止默认浏览器动作(W3C)
				if ( e && e.preventDefault )
					e.preventDefault();
				//IE中阻止函数器默认动作的方式
				else
					window.event.returnValue = false;
				self.getInformation(0,$('.keyWords').val());
			}
		}
	}
	getInformation(page,keyWord){
		page = page || 0;
		keyWord = keyWord || '';
		let self = this;
		sendAjax({
			type:"POST",
			url:"admin/project/findProjectList",
			data:{
				token:token,
				page:page,
				title:keyWord
			},
			success:function(data){
				if(data.code==200){
					let pageList = Math.ceil(data.countList/10);
					let newArray = getPageArray(page+1,pageList,10);
					self.setState({
						items:data.message
					},function(){
						self.setState({
							pageNumber:newArray,
							pageAll:pageList
						},function(){
							$.each($('.pageContainer').find('li'),function(index,item){
								$(item).css({'background':'#fff','color':'#000'})
								if($(item).attr('data-flag')==page){
									$(item).css({'background':'#e7503d','color':'#fff'});
									self.setState({
										pageNow:Number(page+1)
									})
								}
							})
						})
					})
				}else if(data.code==204){
					self.setState({
						items:[],
						pageNumber:[],
						pageAll:0,
						pageNow:"0"
					},function(){
						if(keyWord!=""){
							alert("没有找到相关内容")
						}
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
	tickOrNot(){
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
		let groupId = $(e.target).attr('data-groupId');
		$('.checkAll').css('overflow','hidden');
		//if($(e.target).attr('data-status') == '1'){
			$('.checkAll').siblings().addClass('hideItems');
			$('.itemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
			$('.operationBar').css('overflow','hidden');
			//分页切换
			$('#projectInfo').css('display','block').siblings().css('display','none');
		//}else{
			$('.itemsCheckGather').css('background','#e7503d');
			$('.operationBar').css('overflow','hidden');
			$('.checkAll').siblings().addClass('hideItems');
			$('#organizationCheck').css('display','block').siblings().css('display','none');
		//}
		this.changeHeaderStyle();
		this.setState({
			'id':groupId
		});
		this.props.callbackParent(groupId);
	}
	changePage(page,e){
		if(page<0){
			return;
		}
		//改变样式
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
