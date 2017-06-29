import React from 'react';
import {sendAjax,getPageArray} from '../../../../lib/commonEvent';
export default class MessageList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[],
			'pageNumber':[],
			'pageNow':'',
			pageAll:1,
		}
	}
	render(){
		return(
			<div id="messageList" style={{'padding':'0 2%',position:'relative'}}>
				<table className="checkedList" cellSpacing = '0'>
					<thead>
						<tr>
							<th>
								<input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)} style={{display:'none'}}/>
							</th>
							<th>推送消息内容</th>
							<th>项目/活动</th>
							<th>申请时间</th>
							<th>推送方式</th>
							<th>状态</th>
							<th>备注</th>
						</tr>
					</thead>
					<tbody>
					{
						this.state.items.map(function(item,index){
							return (
								<tr key={index}>
									<td>
										<input  type="checkbox" className="tick" onClick={this.tickOrNot.bind(this,item.id)} data-id={item.id}/>
									</td>
									<td className="messageCon" title={item.message}>{item.message}</td>
									<td>{item.title}</td>
									<td>{item.created_at}</td>
									<td>{item.method==3?'微信':item.method==2?'邮件':'短信'}</td>
									<td>{item.status==2?'未通过':item.status==1?"通过":'待审核'}</td>
									<td className="messageCon">{item.reason}</td>
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
	componentDidMount(){
		this.getInformation();
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.status==0){
			this.getInformation(0,nextProps.keyWord);
		}
	}
	getInformation(page,keyWord){
		let token = sessionStorage.getItem('token');
		let that = this;
		page = page || 0;
		keyWord = keyWord || '';
		sendAjax({
			type:'POST',
			url:"admin/message/findMessageList",
			data:{
				token:token,
				search:keyWord,
				page:page
			},
			success:function(data){
				if(data.code==200){
					if(data.pageAll==0){
						that.setState({
							pageNow:"0"
						})
					}
					let newArray = getPageArray(page+1,data.pageAll,10);
					that.setState({
						'items':data.messageList
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
		return;
		let status = e.target.checked;
		$('.tick').each(function(){
			this.checked = status
		})
	}
	tickOrNot(id,event,self){
		event = event || window.event;
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		if(event.target==true){
			event.target.checked = false;
		}else{
			event.target.checked = true;
		}
		//this.props.callbackParent(groupId);
		this.props.deleteMessage(id);
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
		this.props.deleteMessage('');
		this.setState({
			pageNow:page+1
		})
	}
	jumpToFirst(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		this.getInformation(0,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'});
		this.props.deleteMessage('');
		if(this.state.pageAll!=0){
			this.setState({
				pageNow:1
			})
		}
	}
	jumpToLast(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		this.getInformation(this.state.pageAll-1,this.props.projectTitle);
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'});
		this.props.deleteMessage('');
		this.setState({
			pageNow:this.state.pageAll
		})
	}
	jumpToPages(){
		$(".tick").each(function(index,el){
			el.checked = false;
		})
		this.props.deleteMessage('');
		let page = this.refs.jumpToPages.value;
		if(page!=''){
			$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
			if(page>0&&page<=this.state.pageAll){
				this.getInformation(page-1,this.props.projectTitle);
				this.setState({
					pageNow:page
				})
			}
		}
	}
}
