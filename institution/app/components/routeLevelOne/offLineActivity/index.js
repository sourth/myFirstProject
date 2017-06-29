import React from 'react';
import ActiveHeader from '../../routeLevelTwo/active/activePart/activeHeader/activeHeader';
import ActiveRoute from '../../routeLevelTwo/active/activePart/activeRoute/activeRouteMain'

export default class offLineActivity extends React.Component{
    constructor(){
        super()
        this.state = {
            projectTitle:"",
            keyWord:'',
            activity:0,
            searchOffLineEnroll:'',
            isUpdate:false,
            isIndexList:1
        }
    }
    render(){
        return (
            <div id="activePageContent">
                <div className="checkHeader">
                    <ActiveHeader searchProject = {this.searchProject.bind(this)} activity={this.state.activity} updateOffLineEnrollList = {this.updateOffLineEnrollList.bind(this)} />
                </div>
                <div>
                    <ActiveRoute projectTitle = {this.state.projectTitle}  keyWord={this.state.keyWord} postActivityId={this.postActivityId.bind(this)} searchOffLineEnroll={this.state.searchOffLineEnroll} isUpdate = {this.state.isUpdate} isIndex={this.isIndex.bind(this)}/>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        document.onkeydown = function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode==13){
                self.setState({
                    projectTitle:$(".keyWords").val()
                })
            }
        }
        $('#hash2').click(function(){
            self.setState({
                isIndexList:1
            })
        })
    }
    componentDidUpdate(){
        let self = this;
        document.onkeydown = function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode==13){
                //阻止默认浏览器动作(W3C)
                if ( e && e.preventDefault )
                    e.preventDefault();
                //IE中阻止函数器默认动作的方式
                else
                    window.event.returnValue = false;
                if(self.state.isIndexList==1){
                    self.setState({
                        projectTitle:$(".keyWords").val()
                    })
                }else {
                    self.setState({
                        keyWord:$(".keyWords").val()
                    })
                }
            }
        }
    }
    isIndex(type){
        this.setState({
            isIndexList:type
        })
    }
    searchProject(event){
        let e = event || window.event;
        if($("#enrollList").attr("style")&&$("#offLineEnrollList").attr("style")){
            this.setState({
                projectTitle:$(".keyWords").val()
            })
        }else if($("#offLineEnrollList").attr("style")){
            this.setState({
                keyWord:$(".keyWords").val()
            })
        }else{
            this.setState({
                searchOffLineEnroll:$(".keyWords").val()
            })
        }
    }
    postActivityId(id){
        this.setState({
            activity:id
        })
    }
    updateOffLineEnrollList(flag){
        this.setState({
            isUpdate:flag
        })
    }
}
