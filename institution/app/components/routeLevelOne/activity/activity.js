import React from 'react';
import ProjectActiveHeader from '../../routeLevelTwo/active/activePart/activeHeader/projectActiveHeader';
import ProjectRouteMain from '../../routeLevelTwo/active/projectPart/projectRoute/projectRouteMain';
export default class Project extends React.Component{
	constructor(){
		super()
		this.state = {
			keyWord:""
		}
	}
	render(){
		return (
			<div id="activePageContent">
				<div className="checkHeader">
					<ProjectActiveHeader searchProject = {this.searchProject.bind(this)}/>
				</div>
				<div>
					<ProjectRouteMain projectTitle = {this.state.keyWord} />
				</div>
			</div>
		)
	}
	componentDidMount(){

	}
	searchProject(event){
		let e = event || window.event;
		this.setState({
			keyWord:$(".keyWords").val()
		})
	}

}