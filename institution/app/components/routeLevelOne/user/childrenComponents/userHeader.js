import React from 'react';

export default class UserHeader extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			isUserInfo:0
		}
	}
	render(){
		return(
			<div id="userHeader">
				<div className="bannerBar" style={{height:'36px',margin:'10px 0'}}>
					<div className="checkAll">
						<div className="activeItemsCheckGather" style={{display:this.state.isUserInfo==0?'none':'block'}}>用户详情</div>
						<div className="activeItemsCheckGather titleBackground searchUserList" onClick={this.checkToggle.bind(this)} style={{display:this.state.isUserInfo==0?'block':'none'}}>关注机构</div>
						<ul className="hideItems chooseType" onClick={this.changeItems.bind(this)} style={{zIndex:'10',boxShadow: '10px 10px 5px #888888'}}>
							<li onClick={this.props.changeType.bind(this,1)}>关注机构</li>
							<li onClick={this.props.changeType.bind(this,2)}>支持项目</li>
							<li onClick={this.props.changeType.bind(this,3)}>参与活动</li>
							<li onClick={this.props.changeType.bind(this,4)}>关注项目</li>
							<li onClick={this.props.changeType.bind(this,5)}>发起一起捐</li>
						</ul>
					</div>
					<form style={{marginLeft:'30%',display:this.state.isUserInfo==0?'block':'none'}}>
						<input type="text" placeholder="请输入关键字" className="bannerKeyWords keyWords"/>
						<h2 className="bannerSearch search">
							<img src="img/search.jpg" onClick={this.props.searchUser}/>
						</h2>
					</form>
				</div>
			</div>
		)
	}
	componentDidMount(){
		let self = this;
		window.onhashchange= window.reload = window.onload = function(){
			let hash = window.location.hash;
			if(hash.indexOf('userInfo')!=-1){
				self.setState({
					isUserInfo:1
				})
			}else{
				self.setState({
					isUserInfo:0
				})
			}
		}
		if (window.history && window.history.pushState) {
			$(window).on('popstate', function() {
				let hash = window.location.hash;
				if(hash.indexOf('userInfo')!=-1){
					self.setState({
						isUserInfo:1
					})
				}else{
					self.setState({
						isUserInfo:0
					})
				}
			});
		}
	}
	checkToggle(e){
		let self = this;
		e.nativeEvent.stopImmediatePropagation();
		$('.activeItemsCheckGather').siblings('ul').toggleClass('hideItems');
	}
	changeItems(e){
		$('.activeItemsCheckGather').siblings('ul').addClass('hideItems');
		$('.searchUserList').html($(e.target).text());
	}
}
