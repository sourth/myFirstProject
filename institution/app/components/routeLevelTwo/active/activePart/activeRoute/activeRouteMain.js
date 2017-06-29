import React from 'react';
import ActiveList from './childrenComponents/activeList';
import ActiveAdd from './childrenComponents/activeAdd';
import ActiveInfo from './childrenComponents/activeInfo';
import EnrollList from './childrenComponents/enrollList';
import ActivityCompile from './childrenComponents/activityCompile';
import OffLineEnrollList from './childrenComponents/offLineEnrollList';

export default class ActiveRoute extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			'default':'',
			'projectBook':{}
		}
	}
	onChildChange(newValue){
		this.setState({
			'default':newValue
		})
	}
	render(){
		return(
			<div>
				<ActiveAdd status={this.state.default} {...this.props} callbackParent={this.onChildChange.bind(this)}/>
				<ActiveList status={this.state.default} {...this.props} callbackParent={this.onChildChange.bind(this)} postActivityId={this.props.postActivityId.bind(this)}/>
				<ActiveInfo status={this.state.default} {...this.props} callbackParent={this.onChildChange.bind(this)}/>
				<EnrollList status={this.state.default} {...this.props} callbackParent={this.onChildChange.bind(this)} />
				<OffLineEnrollList status={this.state.default} mark={this.state.mark} {...this.props} callbackParent={this.onChildChange.bind(this)} />
				<ActivityCompile status={this.state.default} {...this.props} callbackParent={this.onChildChange.bind(this)} />
			</div>
		)
	}
	componentDidMount(){

	}
}

ActiveRoute.defaultProps = {
	'hideStyle':{
		'display':'none'
	},
	'spanStyle':{
		'padding':'0 25px',
		'border':'1px solid #cdcdcd',
		'lineHeight':'30px',
		'borderRadius':'5px',
		'marginRight':'10px',
		'cursor':'pointer'
	},
	'spanDefaultStyle':{
		'padding':'0 25px',
		'border':'1px solid #cdcdcd',
		'lineHeight':'30px',
		'borderRadius':'5px',
		'marginRight':'10px',
		'cursor':'pointer',
		'background':'#e7503d',
		'color':'#fff'
	}
}

