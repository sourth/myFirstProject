import React from 'react';
import echarts from 'echarts/lib/echarts'
import {datePicker} from '../../../../../lib/amazeui.datetimepicker.js';
import {sendAjax} from '../../../../../lib/commonEvent';


const token = sessionStorage.getItem('token');
export default class DonatePeople extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			title:'',
			type:'',
			search:'',
			startTime:'',
			autoclose:true
		}
	}
	componentDidMount(){
		let self = this;
		$('.keyWords').parent('form').show();
		datePicker();
		//获取昨天日期
		let date = new Date();
		date.setDate(date.getDate()-1);
		let year = date.getFullYear();
		let month = date.getMonth()+1;
		if(month<10){
			month="0"+month;
		}
		let day = date.getDate();
		if(day<10){
			day='0'+day;
		}
		let nowDate = year + '-' + month + '-' + day;
		this.setState({
			startTime:nowDate
		})
		$("#datetimepicker3").val(nowDate);
		//实例化第一个日历
		$('#datetimepicker3').datetimepicker({
			format: 'yyyy-mm-dd',
			language:  'zh-CN',
			autoclose:this.state.autoclose,
			minView:2,
			endDate:nowDate
		}).on('changeDate', function(ev){
			ev = ev || window.event;
			let date = ev.target.value;
			self.setState({
				startTime:date
			},function(){
				self.getInformation(self.state.search,self.state.title,self.state.type,date);
			})
		});
		this.getInformation();
		this.getTakePartIn();
	}
	showChart(title,time,data,type){
		let myChart = echarts.init(document.getElementById('peopleMain'));
		let seriesArr = [
			{
				name: '机构关注人次',
				type: 'line',
				data: data.group.number
			},{
				name: '项目参与人次',
				type: 'line',
				data: data.project.number
			},{
				name: '项目关注人次',
				type: 'line',
				data: data.projectAttention.number
			},{
				name: '活动参与人次',
				type: 'line',
				data: data.activity.number
			}
		];
		let dataTitle = ['机构关注人次','项目参与人次','项目关注人次','活动参与人次'];
		if(type==1){
			seriesArr = [
				{
					name: '项目参与人次',
					type: 'line',
					data: data.project.number
				},{
					name: '项目关注人次',
					type: 'line',
					data: data.projectAttention.number
				}
			];
			dataTitle = ['项目参与人次','项目关注人次'];
		}else if(type==2){
			seriesArr = [
				{
					name: '活动参与人次',
					type: 'line',
					data: data.activity.number
				}
			];
			dataTitle = ['活动参与人次'];
		}
		let option = {
			title: {
				text:title+ '数据统计折线图',
				textStyle:{fontSize:'14',color:"#666",fontWeight:'500'}
			},
			tooltip: {
				formatter: "{a} <br/>{b} | {c}"
			},
			legend: {
				left:'right',
				data:dataTitle
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: time
			},
			yAxis: {},
			series: seriesArr
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	showPeopleLocation(locationName,locationNum){
		let myChart = echarts.init(document.getElementById('peopleLocation'));
		let barWidth = '';
		if(locationName.length<10){
			barWidth = '50';
		}

		let option = {
			title: {
				//text: '捐赠人地域'
			},
			tooltip: {
				formatter: "{b} | {c}"
			},
			//legend: {
			//	data:['地名']
			//},
			xAxis: {
				data: locationName
			},
			yAxis: {},
			series: [{
				//name: '地名',
				type: 'bar',
				barWidth:barWidth,
				data: locationNum,
				itemStyle: {
					normal: {
						//好，这里就是重头戏了，定义一个list，然后根据所以取得不同的值，这样就实现了，
						color: function(params) {
							// build a color map as your need.
							var colorList = [
								'#C1232B','#B5C334','#FCCE10','#E87C25','#27727B',
								'#FE8463','#9BCA63','#FAD860','#F3A43B','#60C0DD',
								'#D7504B','#C6E579','#F4E001','#F0805A','#26C0C0'
							];
							return colorList[params.dataIndex]
						},
						barBorderRadius:[20,20,20,0],
						//以下为是否显示，显示位置和显示格式的设置了
						label: {
							show: false,
							position: 'top',
//                             formatter: '{c}'
							formatter: '{b}\n{c}'
						}
					},
					emphasis: {
						barBorderRadius: [20,20,20,0]
					}
				}
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.keyWord==-1&&this.state.search!=''){
			this.setState({
				search:'',
				title:'',
				type:''
			},function(){
			this.getInformation();
			})
		}else if(nextProps.title!=''){
			this.setState({
				search:nextProps.keyWord,
				title:nextProps.title,
				type:nextProps.type
			},function(){
				this.getInformation(nextProps.keyWord,nextProps.title,nextProps.type,this.state.startTime);
			})
		}
	}
	render() {
		return (
			<div id="analyzePeople">
				<div id="" className="analyze-box-style">
					<div style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle left">
							数据统计折线图
						</h2>
						<input type="text"  id="datetimepicker3" className="am-form-field right date-time-picker" readOnly/>
						<span className="timeTitle right">截止日期：</span>
					</div>
					<div id="peopleMain" className="peopleMain"></div>
				</div>
				<div id="" className="analyze-box-style">
					<div style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle">
							捐赠人地域
						</h2>
					</div>
					<div id="peopleLocation" className="peopleLocation"></div>
				</div>
			</div>
		)
	}
	//获取折线图数据
	getInformation(id,title,type,startTime){
		let self = this;
		id = id || '';
		title = title || '';
		type = type || '';
		startTime = startTime || '';
		let sendData = {};
		sendData.search = id?id:'';
		sendData.token = token;
		sendData.startTime = startTime?startTime:'';
		sendData.type = type;
		sendAjax({
			type:'POST',
			url:'admin/data/findPeopleLineChart',
			data:sendData,
			success:function(data){
				if(data.code==200){
					let dateArr = data.message.activity.time;
					$.each(dateArr,function(index,item){
						dateArr[index]=item[5]+item[6]+'.'+item[8]+item[9];
					})
					self.showChart(title,dateArr,data.message,type)
				}else if(data.code==204){
					self.showChart('',[],[],'')
				}
			}
		})
	}
	//获取捐赠人地域数据
	getTakePartIn(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findDonationCity',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.showPeopleLocation(data.message.city,data.message.number);
				}
			}
		})
	}
}
