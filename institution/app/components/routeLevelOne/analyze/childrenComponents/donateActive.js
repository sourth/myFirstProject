import React from 'react';
import echarts from 'echarts/lib/echarts'
import {datePicker} from '../../../../../lib/amazeui.datetimepicker.js';
import {sendAjax} from '../../../../../lib/commonEvent';

const token = sessionStorage.getItem('token');
export default class DonateActive extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			autoclose:true
		}
	}
	componentDidMount(){
		let self = this;
		datePicker();
		$('.keyWords').parent('form').hide();
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
		$("#datetimepicker4").val(nowDate);
		//实例化第一个日历
		$('#datetimepicker4').datetimepicker({
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
				this.getInformation(date);
			})
		});
		this.getInformation();
		this.getTakePartIn();
		this.getProjectType();
	}
	showChart(time,data){
		let myChart = echarts.init(document.getElementById('quantityMain'));

		let option = {
			title: {
				//text: '项目活动增长折线图'
			},
			tooltip: {
				formatter: "{a} <br/>{b} | {c}"
			},
			legend: {
				data:['项目数量','活动数量']
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: time
			},
			yAxis: {},
			series: [
				{
					name: '项目数量',
					type: 'line',
					data: data.project.number
				},{
					name: '活动数量',
					type: 'line',
					data:data.activity.number
				}
			]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	//执行地
	showPeopleLocation(locationName,locationNum){
		let myChart = echarts.init(document.getElementById('quantityLocation'));
		let barWidth = '';
		if(locationName.length<10){
			barWidth = '50';
		}

		let option = {
			title: {
				//text: '项目执行地'
			},
			tooltip: {
				formatter: "{a} <br/>{b} | {c}"
			},
			legend: {
				//data:['地名']
			},
			xAxis: {
				data: locationName
			},
			yAxis: {},
			series: [{
				name: '地名',
				type: 'bar',
				barWidth:barWidth,
				data: locationNum,
				itemStyle: {
					normal: {
						color: function(params) {
							// build a color map as your need.
							var colorList = [
								'red','orange','yellow','green','cyan',
								'blue','purple','red','orange','yellow','green','blue',
								'cyan','purple'
							];
							return colorList[params.dataIndex]
						},
						barBorderRadius: [20,20,20,0],
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
	//类型占比视图
	showProjectType(typeName,typeNum){
		let myChart = echarts.init(document.getElementById('quantityType'));
		let option = {
			title : {
				//text: '项目类型占比'
			},
			tooltip : {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			legend: {
				//orient: 'vertical',
				orient:'horizontal',
				//left: 'right',
				data:typeName
			},
			series : [
				{
					name: '类型',
					type: 'pie',
					radius : '55%',
					center: ['50%', '60%'],
					data:typeNum,
					itemStyle: {
						emphasis: {
							shadowBlur: 10,
							shadowOffsetX: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)'
						}
					}
				}
			]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	render() {
		return (
			<div id="analyzeQuanlity">
				<div id="" className="analyze-box-style">
					<div style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle left">
							项目活动增长折线图
						</h2>
						<input type="text"  id="datetimepicker4" className="am-form-field right date-time-picker"  readOnly/>
						<span className="timeTitle right">截止日期：</span>
					</div>
					<div id="quantityMain" className="quantityMain" ></div>
				</div>
				<div id="" className="analyze-box-style">
					<div style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle left">
							项目类型占比
						</h2>
					</div>
					<div id="quantityType" className="quantityType"></div>
				</div>
				<div id="" className="analyze-box-style">
					<div style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle">
							项目执行地
						</h2>
					</div>
					<div id="quantityLocation" className="quantityLocation"></div>
				</div>
			</div>
		)
	}
	//获取折线图数据
	getInformation(startTime){
		let self = this;
		startTime = startTime || '';
		let sendData = {};
		sendData.token = token;
		sendData.startTime = startTime?startTime:'';
		sendAjax({
			type:'POST',
			url:'admin/data/findNumberLineChart',
			data:sendData,
			success:function(data){
				if(data.code==200){
					let dateArr = data.message.project.time;
					$.each(dateArr,function(index,item){
						dateArr[index]=item[5]+item[6]+'.'+item[8]+item[9];
					})
					self.showChart(dateArr,data.message)
				}else if(data.code==204){
					self.showChart([],[])
				}
			}
		})
	}
	//项目类型占比
	getProjectType(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findTypeProportion',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.showProjectType(data.message.name,data.message.project);
				}
			}
		})
	}
	//项目执行地
	getTakePartIn(){
		let self = this;
		sendAjax({
			type:'POST',
			url:'admin/data/findProjectCity',
			data:{
				token:token
			},
			success:function(data){
				if(data.code==200){
					self.showPeopleLocation(data.message.city,data.message.number)
				}
			}
		})
	}
}
