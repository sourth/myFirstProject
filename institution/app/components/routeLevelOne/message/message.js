import React from 'react';
import MessageHeader from '../../routeLevelTwo/message/messageHeader';

export default class Message extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			deleteId:'',
			keyWord:'',
			status:''
		}
	}
	render(){
		return (
			<div>
				<MessageHeader searchProject = {this.searchProject.bind(this)} deleteId = {this.state.deleteId} status={this.state.status} changeStyle={this.changeStyle.bind(this)}/>
				{this.props.children&& React.cloneElement(this.props.children,{
					keyWord:this.state.keyWord,
					deleteMessage:this.deleteMessage.bind(this),
					changeStyle:this.changeStyle.bind(this)
				})}
			</div>
		)
	}
	changeStyle(status){
		this.setState({
			status:status
		})
	}
	searchProject(event){
		this.setState({
			keyWord:$(".keyWords").val()
		})
	}
	deleteMessage(deleteId){
		this.setState({
			deleteId:deleteId
		})
	}
	componentDidMount(){
		let self = this;
		$('#hash4').click(function(){
			self.setState({
				status:0
			})
		})
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
					keyWord:$(".keyWords").val()
				})
			}
		}
		if(window.location.hash=='#/message'){
			this.setState({
				status:0
			})
		}else{
			this.setState({
				status:1
			})
		}
		window.onhashchange = function(){
			self.setState({
				keyWord:''
			},function(){
				$(".keyWords").val('');
				if(window.location.hash=='#/message/orgMessage'){
					self.setState({
						status:1
					})
				}else if(window.location.hash=='#/message/messageGather'){
					self.setState({
						status:1
					})
				}else if(window.location.hash=='#/message'){
					self.setState({
						status:0
					})
				}
			})
		}
	}
}