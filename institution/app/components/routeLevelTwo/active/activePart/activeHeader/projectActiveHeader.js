import React from 'react';
import {Link} from 'react-router';
import './activeHeader.less';

var noMarginRight = {
    'marginRight':'0'
}
export default class ProjectActiveHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            proOrAct:"募捐项目"
        }
    }
    render(){
        return(
            <div className="operationBar">
                <div className="checkAll">
                    <div className="activeItemsCheckGather" onClick={this.checkToggle.bind(this)} style={{backgroundImage:'none'}}>募捐项目</div>
                    {/*<ul className="hideItems" onClick={this.changeItems.bind(this)}>
                     <Link to="/activity1/project"><li>募捐项目</li></Link>
                     <Link to="/activity1/active"><li>活动</li></Link>
                     </ul>*/}
                </div>
                <form style={noMarginRight}>
                    <input type="text" placeholder="请输入关键字" className="keyWords" />
                    <h2 className="search" onClick = {this.props.searchProject}>
                        <img src="img/search.jpg" />
                    </h2>
                </form>
                {/*<div id="delete" className="delete" onClick={this.deleteItems.bind(this)}>删除</div>*/}
               <div id="compile" className="compile hideItems" onClick={this.compile.bind(this)}>编辑</div>
                <div id="increase" className="addNewSth" onClick={this.addNewItems.bind(this)}>新增</div>
                <div className="clearFloat"></div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        $('.operationBar').delegate('#specialDiv','click',function(){
            $('.operationBar').css('overflow','hidden');
            $(this).css('display','none');
            $('#projectCompile').css('display','block').siblings().css('display','none');
        });
    }

    compile(){
        $('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
        $('.operationBar').css('overflow','hidden');
        $('.activeItemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
        $('#projectCompile').css('display','block').siblings().css('display','none');
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
        $('#projectAdd').css('display','block').siblings().css('display','none');
        //活动页的切换
        //$('#activeAdd').css('display','block').siblings().css('display','none');
    }

}
