import React from 'react';
import UserList from './childrenComponents/userList';
import UserHeader from './childrenComponents/userHeader';
import './user.less';

export default class User extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			keyWord:"",
			typeId:1
		}
	}
	render(){
		return (
			<div id="userPageContent">
				<UserHeader searchUser = {this.searchUser.bind(this)} changeType={this.changeUserType.bind(this)}/>
				{this.props.children&& React.cloneElement(this.props.children,{
					keyWord:this.state.keyWord,
					typeId:this.state.typeId
				})}
			</div>
		)
	}
	componentDidMount(){
		let self = this;
		document.onkeydown = function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e&&e.keyCode==13){
				//阻止默认浏览器动作(W3C)
				if ( e && e.preventDefault )
					e.preventDefault();
				//IE中阻止函数器默认动作的方式
				else
					window.event.returnValue = false;
				self.setState({
					keyWord:$(".bannerKeyWords").val()
				})
			}
		}
	}
	changeUserType(type){
		$('.bannerKeyWords').val('');
		this.setState({
			typeId:type,
			keyWord:''
		})
	}
	searchUser(event){
		event = event || window.event;
		this.setState({
			keyWord:$(".bannerKeyWords").val()
		})
	}
}

