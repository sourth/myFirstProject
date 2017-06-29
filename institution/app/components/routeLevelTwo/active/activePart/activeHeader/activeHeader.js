import React from 'react';
import {Link} from 'react-router';
import {sendAjax} from '../../../../../../lib/commonEvent';
import {uploadImage} from '../../../../../../lib/upload'
import './activeHeader.less';

let noMarginRight = {
	'marginRight':'0'
}
const token = sessionStorage.getItem('token');
export default class ActiveHeader extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			proOrAct:"募捐项目",
			enrollUrl:'javascript:void(0)'
		}
	}
	render(){
		return(
			<div className="operationBar">
				<div className="checkAll">
					<div className="activeItemsCheckGather" onClick={this.checkToggle.bind(this)} style={{backgroundImage:'none'}}>线下活动</div>
				</div>
				<form style={noMarginRight}>
					<input type="text" placeholder="请输入关键字" className="keyWords" />
					<h2 className="search" onClick = {this.props.searchProject}>
						<img src="img/search.jpg" />
					</h2>
				</form>
				{/*<div id="delete" className="delete" onClick={this.deleteItems.bind(this)}>删除</div>*/}
				<div id="putInEnroll" className="putInEnroll hideItems">导入报名表</div>
				<div id="putInEnrollContainer"></div>
				<div id="putInEnrollPro"></div>
				<div id="exportEnroll" className="exportEnroll hideItems" ><a href={this.state.enrollUrl} download="报名表">导出报名表</a> </div>
				<div id="compile" className="compile hideItems" onClick={this.compile.bind(this)}>编辑</div>
				<div id="increase" className="addNewSth" onClick={this.addNewItems.bind(this)}>新增</div>
				<div className="clearFloat"></div>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		this.exportEnroll(nextProps.activity);
		if(nextProps.activity!=0&&nextProps.activity!=''){
			uploadImage("putInEnroll","putInEnrollPro",this,3,'putInEnrollContainer',nextProps.activity);
		}
	}
	componentDidMount(){
		let self = this;
		$('.operationBar').delegate('#specialDiv','click',function(){
			$('.operationBar').css('overflow','hidden');
			$(this).css('display','none');
			$('#activityCompile').css('display','block').siblings().css('display','none');
		});
	}
	//导出报名表
	exportEnroll(id){
		let self = this;
		id = id || 0
		sendAjax({
			type:'POST',
			url:'admin/activity/findActivityExcel',
			data:{
				token:token,
				activityId:id
			},
			success:function(data){
				if(data.code==200){
					self.setState({
						enrollUrl:data.message.path
					})
				}
			}
		})
	}
	compile(){
		$('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
		$('.operationBar').css('overflow','hidden');
		$('.activeItemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
		$('#activityCompile').css('display','block').siblings().css('display','none');
		$("#activityCoPro").html('');
	}
	checkToggle(){
		$('.activeItemsCheckGather').siblings('ul').toggleClass('hideItems');
	}
	changeItems(e){
		$('.activeItemsCheckGather').siblings('ul').addClass('hideItems');
		$('.activeItemsCheckGather').html($(e.target).text());
	}
	deleteItems(){
		if($('.tick').is(':checked')){
			$('#coverView').css('display','block');
		}
	}
	addNewItems(){
		$('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
		$('.activeItemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
		$('.operationBar').css('overflow','hidden');
		//项目页的切换
		//$('#projectAdd').css('display','block').siblings().css('display','none');
		//活动页的切换
		$('#activeAdd').css('display','block').siblings().css('display','none');
	}
	
}
