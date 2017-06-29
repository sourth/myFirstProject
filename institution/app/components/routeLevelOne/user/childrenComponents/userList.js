import React from 'react';
import {sendAjax,getPageArray,getQueryString} from '../../../../../lib/commonEvent'

export default class UserList extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[],
			'pageNumber':[],
			'pageNow':'',
			pageAll:1
		}
	}
	render(){
		return (
			<div style={{position:"relative"}}>
				<div id="userList">
					<table className="checkedList userListTable" cellSpacing = '0'>
						<thead>
						<tr>
							<th>排序</th>
							<th>用户昵称</th>
							{/*<th>微信账号</th>*/}
							<th>姓名</th>
							{/*<th>积分</th>*/}
							{/*<th>捐款次数</th>
							<th>捐款钱数</th>
							<th>参与活动次数</th>*/}
							<th>积分</th>
							{/*<th>参与活动次数</th>*/}
							<th>性别</th>
							{/*<th>证件号</th>*/}
							<th>邮箱</th>
							<th>手机号</th>
							{/*<th>时间</th>*/}
							<th>操作</th>
						</tr>
						</thead>
						<tbody>
						{
							this.state.items.map(function(item,index){
								return (
									<tr key={index}>
										<td>{index+1}</td>
										<td>{item.name}</td>
										{/*<td>-</td>*/}
										<td>{item.realname?item.realname:"-"}</td>
										{/*<td>-</td>*/}
										{/*<td>{item.count?item.count:'0'}</td>
										<td>{item.total?item.total:'0'}</td>
										<td>{item.number}</td>*/}
										<td>{item.score}</td>
										<td>{item.sex == 0?'男':item.sex ==1?"女":"-"}</td>
										{/*<td>{item.id_number?item.id_number:'-'}</td>*/}
										<td>{item.mail?item.mail:'-'}</td>
										<td>{item.mobile?item.mobile:'-'}</td>
										<td className="cursorPointer"><a href={"#/user/userInfo?id="+item.id} style={{color:'#333'}}>查看详情</a></td>
										{/*<td>{item.created_at}</td>*/}
									</tr>
								)
							}.bind(this))
						}
						</tbody>
					</table>
				</div>
				<div className="pageList" >
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
	getInformation(page,keyWord,typeId){
		let token = sessionStorage.getItem('token');
		let obj = getQueryString();
		page = page || 0;
		keyWord = keyWord || '';
		typeId = typeId || obj.typeId || 1;
		let that = this;
		sendAjax({
			type:"POST",
			url:"admin/user/findUserList",
			data:{
				token:token,
				page:page,
				search:keyWord,
				type:typeId
			},
			success:function(data){
				if(data.code == 200){
					if(data.count==0){
						that.setState({
							pageNow:"0"
						})
					}
				    let newArray = getPageArray(page+1,data.count,10);
					that.setState({
						items:data.message
					},function(){
						that.setState({
							pageNumber:newArray,
							pageAll:data.count
						},function(){
							$.each($('.pageContainer').find('li'),function(index,item){
								$(item).css({background:'#fff',color:'#000'})
								if($(item).attr('data-flag')==page){
									$(item).css({'background':'#e7503d','color':'#fff'});
									that.setState({
										pageNow:Number(page+1)
									})
								}
							})
						})
					})
				}else if(data.code==204&&data.message=='NULL'){
					that.setState({
						items:[]
					},function(){
						that.setState({
							pageNumber:[],
							pageAll:0,
							pageNow:"0"
						})
					})
				}
			}
		})
	}
	componentWillReceiveProps(nextProps){
		this.getInformation(0,nextProps.keyWord,nextProps.typeId);
	}
	changePage(page,e){
		if(page<0){
			return;
		}
		//改变样式
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'});
		//获取数据
		this.getInformation(page,this.props.keyWord,this.props.typeId);
		this.setState({
			pageNow:page+1
		})
	}
	jumpToFirst(){
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		this.getInformation(0,this.props.keyWord,this.props.typeId);
		if(this.state.pageAll!=0){
			this.setState({
				pageNow:1
			})
		}
	}
	jumpToLast(){
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		this.getInformation(this.state.pageAll-1,this.props.keyWord,this.props.typeId);
		this.setState({
			pageNow:this.state.pageNumber.length
		})
	}
	jumpToPages(){
		$('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
		let page = this.refs.jumpToPages.value;
		if(page!=''){
			if(page>0&&page<=this.state.pageAll){
				this.getInformation(page-1,this.props.keyWord,this.props.typeId);
				this.setState({
					pageNow:page
				})
			}
		}
	}
}
