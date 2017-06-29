import React from 'react';
import Link from 'react-router';
import './orgHeader.less';
import {sendAjax} from '../../../lib/commonEvent'

export default class OrgHeader extends React.Component{
	constructor(){
		super();
		this.state={
			"userImage":'img/userImg.png',
			"userInfo":{
				logo:"img/groupLogo.png",
				"realName":'管理员',
				"roleName":'manager',
				groupName:'为爱联劝机构后台'
			}
		}
	}
	render(){
		return (
			<div className="pageHeader">
				<div className="headerContent">
					<div className="headerLogo">
						<a>
							<img src={this.state.userInfo.logo}/>
						</a>
						<a className="groupName" style={{fontFamily:'fzzhj'}}>{this.state.userInfo.groupName}</a>
					</div>
					<div className="administrator">
						<div className="personalImg">
							<img src={this.state.userImage}/>
						</div>
						<div className="userInformation">
							<p>
								<span>{this.state.userInfo.roleName?this.state.userInfo.roleName:'manager'}</span>
							</p>
							<p>
								<span>{this.state.userInfo.realName?this.state.userInfo.realName:'管理员'}</span>
								<span onClick={this.dropOut.bind(this)} className="cursorPointer">退出</span>
							</p>
							
						</div>
					</div>
				</div>
			</div>
		)
	}
	componentDidMount(){
		this.getGroupMessage()
	}
	getGroupMessage(){
		let content = JSON.parse(sessionStorage.getItem('content'));
		if(content){
			if(content.logo==''){
				content.logo='img/groupLogo.png'
			}
			this.setState({
				userInfo:content
			})
		}
	}
	dropOut(){
		sessionStorage.removeItem("token");
		window.location.href = "index.html";
	}
}