import React from 'react';
import ProjectList from './childrenComponents/projectList';
import ProjectInfo from './childrenComponents/projectInfo';
import ProjectCompile from './childrenComponents/projectCompile';
import ProjectAdd from './childrenComponents/projectAdd';
import ProjectBook from './childrenComponents/projectBook';
import AddProjectProgress from './childrenComponents/addProjectProgress';
import ProjectProgressList from './childrenComponents/projectProgressList';
import DonateMoneyList from './childrenComponents/donateMoneyList';
import '../../projectRoute.less'

export default class ProjectRouteMain extends React.Component{
	constructor(){
		super()
		this.state = {
			'default':null,
			'projectBook':null,
			'projectBookStatus':null
		}
	}
	onChildChange(newValue){
		this.setState({
			'default':newValue
		})
	}
	onProjectBookChange(newValue){
		this.setState({
			'projectBook':newValue
		})
	}
	onProjectBookStatus(newValue){
		this.setState({
			'projectBookStatus':newValue
		})
	}
	render(){
		return(
			<div>
				<ProjectAdd {...this.props} callbackParent={this.onChildChange.bind(this)} projectBook={this.state.projectBook} projectBookStatusBack={this.onProjectBookStatus.bind(this)}/>
				<ProjectList {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)}/>
				<ProjectInfo {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)} projectBookStatusBack={this.onProjectBookStatus.bind(this)} />
				<ProjectCompile {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)} projectBookStatusBack={this.onProjectBookStatus.bind(this)} projectBook={this.state.projectBook}/>
				<ProjectBook {...this.props} status={this.state.default} projectBook={this.state.projectBook} callbackParent={this.onChildChange.bind(this)} projectBookBack={this.onProjectBookChange.bind(this)} projectBookStatus={this.state.projectBookStatus}/>
				<AddProjectProgress {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)}/>
				<ProjectProgressList {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)}/>
				<DonateMoneyList {...this.props} status={this.state.default} callbackParent={this.onChildChange.bind(this)}/>
			</div>
		)
	}
	componentWillReceiveProps(nextProps){
		this.setState({
			'default':nextProps.compileId
		})
	}
}

ProjectRouteMain.defaultProps = {
	hideStyle:{
		'display':'none'
	}
}
