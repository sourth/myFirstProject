import React from 'react';
import {sendAjax} from '../../../../lib/commonEvent';
import './index.less';
import AnalyzeHeader from './childrenComponents/analyzeHeader';

const token = sessionStorage.getItem('token');
export default class DataAnalyze extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			keyWord:'',
			title:'',
			type:'',
			totalMoney:0,
			peopleNumber:{
				project:0,
				activity:0
			},
			publishNumber:{
				project:0,
				activity:0
			}
		}
	}
	render(){
		return(
			<div id="analyze">
				<AnalyzeHeader chooseKeyWord={this.chooseKeyWord.bind(this)}/>
				<div className="analyzeItems">
					<a href="#/dataAnalyze/totalMoney" onClick={this.chooseThisItem.bind(this)} ref="totalMoney">
						<p>筹款总额</p>
						<p>{this.state.totalMoney}元</p>
					</a>
					 <a href="#/dataAnalyze/people" onClick={this.chooseThisItem.bind(this)} ref="people">
						<p>项目/活动参与人次</p>
						<p>{this.state.peopleNumber.project}人/{this.state.peopleNumber.activity}人</p>
					</a>
					<a href="#/dataAnalyze/quantity" onClick={this.chooseThisItem.bind(this)} ref="quantity">
						<p>项目数量/活动数量</p>
						<p>{this.state.publishNumber.project}个/{this.state.publishNumber.activity}个</p>
					</a>
				</div>
				{this.props.children&& React.cloneElement(this.props.children,{
					keyWord:this.state.keyWord,
					title:this.state.title,
					type:this.state.type
				})}
			</div>
		)
	}
	componentDidMount(){
		document.onkeydown = function(event){
			var e = event || window.event || arguments.callee.caller.arguments[0];
			if(e&&e.keyCode==13){
				//阻止默认浏览器动作(W3C)
				if ( e && e.preventDefault )
					e.preventDefault();
				//IE中阻止函数器默认动作的方式
				else
					window.event.returnValue = false;
			}
		}
	}
	//搜索
	chooseKeyWord(id,title,type){
		this.setState({
			keyWord:id,
			title:title,
			type:type
		})
	}
	chooseThisItem(event){
		event = event || window.event;
		if(event.target.tagName=='P'||event.target.tagName=='p'){
			$(event.target).parent('a').css({
				background:'#e6503c',
				color:'#fff'
			}).siblings('a').css({
				background:'#eee',
				color:'#333'
			})
		}else{
			$(event.target).css({
				background:'#e6503c',
				color:'#fff'
			}).siblings('a').css({
				background:'#eee',
				color:'#333'
			})
		}
	}
	componentDidMount(){
		let self = this;
		window.onload = window.onhashchange = function(){
			$('.keyWords').val('');
			let target = ''
			if(window.location.hash=='#/dataAnalyze/totalMoney'||window.location.hash=='#/dataAnalyze'|| window.location.hash=='#/'||window.location.hash=='#'){
				target = self.refs.totalMoney;
			}else if(window.location.hash=='#/dataAnalyze/people'){
				target = self.refs.people;
			}else if(window.location.hash=='#/dataAnalyze/quantity'){
				target = self.refs.quantity;
			}
			$(target).css({
				background:'#e6503c',
				color:'#fff'
			}).siblings('a').css({
				background:'#eee',
				color:'#333'
			})
		}
		this.getTotalMoney();
		this.getGroupPublish();
		this.getPeopleNumber();
	}
	//获取机构总额
	getTotalMoney(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findTotal',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.setState({
						totalMoney:data.message
					})
				}
			}
		})
	}
	//获取机构项目活动数量
	getGroupPublish(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findPublish',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.setState({
						publishNumber:data.message
					})
				}
			}
		})
	} //获取机构项目活动参与人次
	getPeopleNumber(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findPeopleNumber',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.setState({
						peopleNumber:data.message
					})
				}
			}
		})
	}
}
