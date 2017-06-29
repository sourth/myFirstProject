import React from 'react';
import echarts from 'echarts/lib/echarts'
// 引入柱状图 折线图 饼图
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend'
import {datePicker} from '../../../../../lib/amazeui.datetimepicker.js';
import {sendAjax} from '../../../../../lib/commonEvent';

const token = sessionStorage.getItem('token');
export default class DonateMoney extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			title:'',
			type:'',
			search:'',
			startTime:'',
			percentageDate:[],
			percentageProject:[],
			percentageActivity:[],
			autoclose:true
		}
	}
	componentDidMount(){
		let self = this;
		$('.keyWords').parent('form').show();
		//引入日历
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
		$("#datetimepicker2,#datetimepicker1").val(nowDate);
		//实例化第一个日历
		$('#datetimepicker1').datetimepicker({
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
		//实例化第二个日历
		$('#datetimepicker2').datetimepicker({
			format: 'yyyy-mm-dd',
			language:  'zh-CN',
			autoclose:true,
			minView:2,
			endDate:nowDate
		}).on('changeDate', function(ev){
			ev = ev || window.event;
			let date = ev.target.value;
			self.getMoneyData(date);
		});
		//获取折线图和列表数据
		this.getInformation();
		this.getMoneyData();
	}
	showChart(title,dataTime,data){
		let myChart = echarts.init(document.getElementById('donationMoney'));
		let option = {
			title: {
				text: title + '筹款总额折线图',
				padding: [3, 30],
				textStyle:{fontSize:'14',color:"#666",fontWeight:'500'},
			}
			,
			tooltip: {
				formatter: "{a} <br/>{b} | {c}"
			},
			legend: {
				data:['总额度(元)']
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				data: dataTime
			},
			yAxis: {},
			series: [{
				name: '总额度(元)',
				type: 'line',
				data: data
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}
	componentWillReceiveProps(nextProps){
		if(nextProps.keyWord==-1&&this.state.search!=''){
			let type = $('#chooseType').val();
			if(type==0){
				this.setState({
					search:"",
					title:"",
					type:""
				},function(){
					this.getInformation('','','',this.state.startTime);
				})
			}else if(type==1){
				this.setState({
					type:1,
					title:'项目',
					search:''
				},function(){
					this.getInformation('','项目',1,this.state.startTime);
				})
			}else if(type==2){
				this.setState({
					type:2,
					title:'活动',
					search:''
				},function(){
					this.getInformation('','活动',2,this.state.startTime);
				})
			}
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
			<div id="analyzeFirstPage">
				<div id="firstPage-firstDate" className="analyze-box-style">
					<div>
						<h2 className="analyzeTitle">
							筹款总额折线图
						</h2>
					</div>
					<select name="" id="chooseType" onChange={this.chooseDataType.bind(this)}>
						<option value="0">筹款总额变化</option>
						<option value="1">项目总额变化</option>
						<option value="2">活动总额变化</option>
					</select>
					<input type="text"  id="datetimepicker1" className="am-form-field right date-time-picker" readOnly/>
					<span className="timeTitle right">截止日期：</span>
				</div>
				<div id="analyzeMoney">
					<div id="donationMoney" className="donateMoney" ></div>
				</div>
				<div id="donationTotalMoney" className="analyze-box-style">
					<div id="totalMoneyTitle" style={{overflow:'hidden'}}>
						<h2 className="analyzeTitle left">
							筹款总额新增百分比
						</h2>
						<input type="text"  id="datetimepicker2"  className="am-form-field right date-time-picker" readOnly/>
						<span className="timeTitle right">截止日期：</span>
					</div>
					<div className="analyze-money-data">
						<div className="analyze-money-date">
							<span className="data-title">日期</span>
							{
								this.state.percentageDate.map(function(item,i){
									return(<span key={i} className="analyze-data-span">{item}</span>)
								})
							}
						</div>
						<div className="analyze-money-project">
							<span className="data-title">项目</span>
							{
								this.state.percentageProject.map(function(item,i){
									return(<span key={i} className="analyze-data-span">{parseInt(item*100)+'%'}</span>)
								})
							}
						</div>
						<div className="analyze-money-activity">
							<span className="data-title">活动</span>
							{
								this.state.percentageActivity.map(function(item,i){
									return(<span key={i} className="analyze-data-span">{parseInt(item*100)+'%'}</span>)
								})
							}

						</div>
					</div>
				</div>
			</div>
		)
	}
	chooseDataType(event){
		event = event || window.event;
		let type = event.target.value;
		if(type==0){
			this.setState({
				search:"",
				title:"",
				type:""
			},function(){
				this.getInformation('','','',this.state.startTime);
			})
		}else if(type==1){
			this.setState({
				type:1,
				title:'项目',
				search:''
			},function(){
				this.getInformation('','项目',1,this.state.startTime);
			})
		}else if(type==2){
			this.setState({
				type:2,
				title:'活动',
				search:''
			},function(){
				this.getInformation('','活动',2,this.state.startTime);
			})
		}
	}
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
			url:'admin/data/findTotalLineChart',
			data:sendData,
			success:function(data){
				if(data.code==200){
					let dateArr = data.message.time;
					$.each(dateArr,function(index,item){
						dateArr[index]=item[5]+item[6]+'.'+item[8]+item[9];
					})
					self.showChart(title,dateArr,data.message.number)
				}else if(data.code==204){
					self.showChart('',[],[])
				}
			}
		})
	}
	getMoneyData(startTime){
		let self = this;
		let sendData = {};
		startTime = startTime || '';
		sendData.token = token;
		sendData.startTime = startTime;
		sendAjax({
			type:'POST',
			url:'admin/data/findTotalPercentage',
			data:sendData,
			success:function(data){
				if(data.code==200){
					let dateArr = data.message.time;
					$.each(dateArr,function(index,item){
						dateArr[index]=item[5]+item[6]+'.'+item[8]+item[9];
					})
					self.setState({
						percentageDate:dateArr,
						percentageProject:data.message.project,
						percentageActivity:data.message.activity
					})
				}else if(data.code==204){
					self.setState({
						percentageDate:[],
						percentageProject:[],
						percentageActivity:[]
					})
				}
			}
		})
	}
}

