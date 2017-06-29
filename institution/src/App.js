import React from 'react';
import ReactDOM from 'react-dom';
import {Route,Link,Router,IndexRoute,hashHistory} from 'react-router';
import DataAnalyze from '../App/components/routeLevelOne/analyze/analyze';
import Project from '../App/components/routeLevelOne/activity/activity';
import OffLineActivity from '../App/components/routeLevelOne/offLineActivity';
import Donation from '../App/components/routeLevelOne/donation/donation';
import User from '../App/components/routeLevelOne/user/user';
import SystemNotification from '../APP/components/routeLevelOne/systemNotification';
import Message from '../App/components/routeLevelOne/message/message';
import Account from '../App/components/routeLevelOne/account/account';
import GroupMessage from '../App/components/routeLevelOne/groupMessage'
import OrgHeader from '../App/components/orgHeader/orgHeader';
import ActiveRouteMain from '../App/components/routeLevelTwo/active/activePart/activeRoute/activeRouteMain';
import ProjectRouteMain from '../App/components/routeLevelTwo/active/projectPart/projectRoute/projectRouteMain';
import ActMessage from '../App/components/routeLevelTwo/message/actMessage';
import ProMessage from '../App/components/routeLevelTwo/message/proMessage';
import MessageList from '../App/components/routeLevelTwo/message/messageList';
import AccountList from '../App/components/routeLevelTwo/accountComponent/accountList';
import AddAccount from '../App/components/routeLevelTwo/accountComponent/addAccount';
import RoleList from '../App/components/routeLevelTwo/accountComponent/compileAccount';
import AddRole from '../App/components/routeLevelTwo/accountComponent/setAccount';
import DonatePeople from '../App/components/routeLevelOne/analyze/childrenComponents/donatePeople';
import DonateMoney from '../App/components/routeLevelOne/analyze/childrenComponents/donateMoney';
import DonateActive from '../App/components/routeLevelOne/analyze/childrenComponents/donateActive';
import UserList from '../App/components/routeLevelOne/user/childrenComponents/userList';
import UserInfo from '../App/components/routeLevelOne/user/childrenComponents/urserInfo';
import '../styles/reset.less';
import '../styles/App.less';


export default class App extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'items':[false,false,false]
		}
	}
    render(){
        return (
            <div className="App">
				<div id="coverBox">
					<div className="loader" id="loader">
						<div className="loader-inner ball-spin-fade-loader">
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
							<div></div>
						</div>
					</div>
				</div>
            	<div className="deleteItem" id="coverView">
            		<div className="lastAsk">确认删除？</div>
            		<div className="handleBar">
            			<button id="confirm" onClick={this.deleteItems.bind(this)}>确认</button>
            			<button id="cancel" onClick={this.deleteCancel.bind(this)}>取消</button>
            		</div>
            	</div>
            	<OrgHeader/>
            	<div className="manageContent">
	                <div className="list">
	                    <ul id="manageContentList" onClick={this.changeStyle.bind(this)}>
							<li key="0" ref="power3"><Link id="hash0" to="/dataAnalyze/totalMoney" activeClassName='routeActive'>数据分析</Link></li>
							<li key="1" ref="power1"><Link id="hash1" to="project" activeClassName='routeActive'>募捐项目</Link></li>
							<li key="2" ref="power0"><Link id="hash2" to="activity" activeClassName='routeActive'>线下活动</Link></li>
							<li key="3" ref="power2"><Link id="hash3" to="donation" activeClassName='routeActive'>善款管理</Link></li>
							<li key="4" ref="power8"><Link id="hash4" to="user" activeClassName='routeActive'>用户管理</Link></li>
							<li key="5" ref="power4"><Link id="hash5" to="message" activeClassName='routeActive'>消息推送</Link></li>
							<li key="6" ref="power7"><Link id="hash6" to="account" activeClassName='routeActive'>账号管理</Link></li>
							{/*<Link to="banner7"><li key="7" id="hash7">图片设置</li></Link>*/}
							<li key="7" ref="power6"><Link to="systemNotification" id="hash7" activeClassName='routeActive'>消息通知</Link></li>
							<li key="8" ref="power5"><Link to="groupMessage" id="hash8" activeClassName='routeActive'>机构信息</Link></li>
	                    </ul>
	                </div>
	                <div className="detailsView">
	                	{this.props.children}
	                </div>
	            </div>
            </div>
        )
    }
    componentWillMount(){
    	var token = sessionStorage.getItem('token');
    	if(!token){
    		alert('请先登录');
    		window.location.href = 'index.html';
    	}
    }
	componentDidMount(){
		document.addEventListener('click',function(){
			$('.itemsCheckGather').siblings('ul').addClass('hideItems');
			$('.newProjectContainer').siblings('ul').addClass('hideItems');
			$('.activeItemsCheckGather').siblings('ul').addClass('hideItems');
		},false)
		this.myPowers();
	}
	componentWillUnmount(){
		document.removeEventListener('click',function(){
			$('.itemsCheckGather').siblings('ul').addClass('hideItems');
			$('.newProjectContainer').siblings('ul').addClass('hideItems');
			$('.activeItemsCheckGather').siblings('ul').addClass('hideItems')
		},false)
	}
	//权限
	myPowers(){
		let self = this;
		let content = JSON.parse(sessionStorage.getItem('content'));
		let originPowers = [1,2,3,4,5,6,7,8];
		let powers = content.power;
		if(powers!=0){
			if(powers.indexOf(1)==-1){
				$(this.refs.power0).remove();
			}
			$.each(originPowers,function(index,item){
				if(powers.indexOf(Number(item))==-1){
					$(self.refs['power'+item]).remove();
				}
			})
		}
	}
    changeStyle(e){
		let id = e.target.id;
		if(id=="hash1"){
			//location.reload();
			$("#projectList").show().siblings().hide();
			$(".checkAll").siblings().removeClass("hideItems");
			$("#compile").addClass("hideItems");
		}else if(id=="hash2"){
			//location.reload();
			$("#activeList").show().siblings().hide();
			$(".checkAll").siblings().removeClass("hideItems");
			$("#compile").addClass("hideItems");
			$("#exportEnroll,#putInEnroll").addClass("hideItems");
		}else if(id=="hash8"){
			$("#groupMessageShow").show().siblings().hide();
		}else if(id=='hash3'){
			$('#donationList').show().siblings().hide();
			$(".checkAll").siblings().removeClass("hideItems");
		}
    }
    deleteItems(){
    	var that = this;
		var items = this.state.items;
		$('.tick').each(function(index, el){
			if($(el).is(':checked')){
				$(this).parents('li').remove();
				items.splice(index,1,false);
				that.setState({
					items
				});
			}
		})
		$('#coverView').css('display','none');
    }
	deleteCancel(){
		$('#coverView').css('display','none');
	}
}

ReactDOM.render((
    <div>
        <Router history={hashHistory}>
        	<Route path='/' component={App}>
        		<IndexRoute component={DataAnalyze}/>
				<Route path="/dataAnalyze/totalMoney" component={DataAnalyze} >
					<IndexRoute component={DonateMoney} />
					<Route path="/dataAnalyze/totalMoney" component={DonateMoney} />
					<Route path="/dataAnalyze/people" component={DonatePeople} />
					<Route path="/dataAnalyze/quantity" component={DonateActive} />
				</Route>
				<Route path="project" component={Project} />
				<Route path="activity" component={OffLineActivity} />
				<Route path="donation" component={Donation} />
	            <Route path="user" component={User}>
					<IndexRoute component={UserList} />
					<Route path="/user/userList" component={UserList} />
					<Route path="/user/userInfo" component={UserInfo} />
				</Route>
				<Route path="message" component={Message} >
					<IndexRoute component={MessageList} />
					<Route path="/message/actMessage" component={ActMessage} />
					<Route path="/message/messageGather" component={ProMessage} />
					<Route path="/message/messageList" component={MessageList} />
				</Route>
				<Route path="account" component={Account} >
					<IndexRoute component={AccountList} />
					<Route path="/account/accountList" component={AccountList} />
					<Route path="/account/addAccount" component={AddAccount} />
					<Route path="/account/roleList" component={RoleList}/>
					<Route path="/account/addRole" component={AddRole}/>
				</Route>
				<Route path="systemNotification" component={SystemNotification} />
	            <Route path="groupMessage" component={GroupMessage} />
			</Route>
        </Router>
    </div>
),document.getElementById("app"));