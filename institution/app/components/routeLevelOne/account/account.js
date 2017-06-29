import React from 'react';
import './index.less';
import AccountHeader from '../../routeLevelTwo/accountComponent/accountHeader';
import {sendAjax,isVal} from '../../../../lib/commonEvent';


const token = sessionStorage.getItem("token");
export default class Account extends React.Component{
	constructor(){
		super();
		this.state = {
			keyWord:''
		}
	}
	render(){
		return (
			<div id="accountPage">
				<AccountHeader searchAccount = {this.searchAccount.bind(this)} />
				{this.props.children&& React.cloneElement(this.props.children,{
					keyWord:this.state.keyWord
				})}
			</div>
		)
	}
	componentDidMount(){
		let self = this;
		document.onkeydown = function(event) {
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if (e && e.keyCode == 13) {
				if (e && e.keyCode == 13) {
					//阻止默认浏览器动作(W3C)
					if (e && e.preventDefault)
						e.preventDefault();
					//IE中阻止函数器默认动作的方式
					else
						window.event.returnValue = false;
					self.setState({
						keyWord: $(".keyWords").val()
					})
				}
			}
		}
	}
	searchAccount(event){
		let e = event || window.event;
		this.setState({
			keyWord:$(".keyWords").val()
		})
	}
}
