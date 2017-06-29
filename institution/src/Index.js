import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/reset.less';
import '../styles/Index.less';
import {sendAjax} from '../lib/commonEvent';

export default class Index extends React.Component{
	constructor(){
		super()
		this.state = {
			groupName:''
		}
	}
	render(){
		return(
			<div>
				<div className="loginLogo">
					<div className="logoContainer">
						<img src="img/logo.png" alt="logo" />
					</div>
				</div>
				<div className="banner">
					<div className="loginInformation">
						<h2>账号登录</h2>
						<input type="text" placeholder="请输入用户名" id="userName" onBlur={this.sendGroupName.bind(this)}/>
						<input type="password" placeholder="请输入密码" id="passWord"/>
						<div onClick={this.login.bind(this)}>登录</div>
						<div className="freeRegister">
							<a href={"password.html"+this.state.groupName}>忘记密码</a>
							<a href="register.html" target="_blank">免费注册</a>
						</div>
					</div>
				</div>
				<div className="otherLink">
					<ul>
						<li>
							<a href="../../agreement/briefIntroduction.html" target="_blank">关于为爱联劝</a>
						</li>
						<li>
							<a>帮助中心</a>
						</li>
						<li>
							<a href="../../agreement/briefIntroduction.html" target="_blank">联系我们</a>
						</li>
						<li>
							<a href="../../agreement/lawAndPrivacy.html" target="_blank">法律声明及隐私权政策</a>
						</li>
						<li>
							<a href="../../agreement/IntellectualPropertyStatement.html" target="_blank">知识产权</a>
						</li>
					</ul>
					<div>备案信息</div>
				</div>
			</div>
		)
	}
	componentDidMount(){
		let self = this;
		document.onkeydown = function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e&&e.keyCode==13){
				self.login()
			}
		}
	}
	sendGroupName(e){
		 e = e || window.event;
		 let groupName = encodeURIComponent(e.target.value);
		if(groupName!=''){
			this.setState({
				groupName:'?groupName='+groupName
			})
		}
	}
	login(){
		var username = $('#userName').val();
		var password = $('#passWord').val();
		if(username != '' && password != ''){
			sendAjax({
				type:'POST',
				url:"adminLogin/group",
				data:{'username':username,'password':password},
				success:function(data){
					if(data.code == 200 ){
						if(data.content.power==101){
							alert('该账号无任何权限，请联系管理员确认！');
						}else{
							let url = '#/dataAnalyze/totalMoney';
							let power = data.content.power;
							if(power==0||power.indexOf(3)!=-1){
								url = '#/dataAnalyze/totalMoney';
							}else if(power.indexOf(1)!=-1){
								url = '#/project';
							}else if(power.indexOf(2)!=-1){
								url = '#/donation'
							}else if(power.indexOf(8)!=-1){
								url = '#/user'
							}else if(power.indexOf(4)!=-1){
								url = '#/message'
							}else if(power.indexOf(7)!=-1){
								url = '#/account'
							}else if(power.indexOf(6)!=-1){
								url = '#/systemNotification'
							}else if(power.indexOf(5)!=-1){
								url = '#/groupMessage'
							}
							sessionStorage.setItem('content',JSON.stringify(data.content));
							sessionStorage.setItem('token',data.token)
							window.location.href = 'main.html'+url;
						}
					}else if(data.code == 304){
						sessionStorage.setItem('notPostToken',data.token);
						let myUrl = "liable="+encodeURIComponent(data.message.liable)+"&reason="+encodeURIComponent(data.message.reason)+"&status=1&groupId="+encodeURIComponent(data.message.groupId)
						window.location.href="register.html#/submitAudit?"+myUrl;
					}else if(data.code == 303){
						let myUrl = "liable="+encodeURIComponent(data.message)+"&status=2";
						window.location.href="register.html#/submitAudit?"+myUrl;
					}else{
						alert("用户名或密码有误！");
					}
				}
			})
		}else{
			alert('用户名或密码不能为空！')
		}
	}
}

ReactDOM.render(<Index />,document.getElementById('index'))
