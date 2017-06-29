/**
 * Created by Rockwill-html on 2017/5/27.
 */
//项目预览，项目详情
import React from 'react';
import './projectDetail.less'

export default class ProjectDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        let projectDetails = this.props.previewInformation;
        if(projectDetails.content!=''&&projectDetails.content!=undefined){
            $('.project-detail').html(projectDetails.content)
        }
        return(<div className="projectPreviewContainer">
            <div id="projectPreviewBox" onScroll={this.wheelSize.bind(this)} ref="projectPreviewBox">
                <div className="previewBottom" ref="previewBottom">
                    <span>我要捐款</span>
                    <span>邀请朋友一起捐</span>
                </div>
                <div className="projectDetBan">
                    <img src={projectDetails.cover} alt="" className="projectDetail_banner"/>
                </div>
                <div className="activeFinish" style={{background:"#fff"}}>
                    <p className="activeTitle"> <span>{projectDetails.projectTypeText?projectDetails.projectTypeText:projectDetails.projectType}</span><i className="activeTitleContent">{projectDetails.title}</i></p>
                    <div className="activeLine"></div>
                    <p className="activeEnd"><span style={{display:projectDetails.money==0?'none':projectDetails.getMoney==0?'none':'inline-block'}}>已完成<i>0%</i></span><i style={{display:projectDetails.money==0?'inline-block':projectDetails.getMoney==0?'inline-block':'none'}}>不设目标</i></p>
                </div>
                <div className="collect-header" style={{background:"#fff"}}>
                    <ul>
                        <li><b>筹款目标</b>
                            <span>{projectDetails.money==0?'不设目标':projectDetails.money}</span><span style={{display:projectDetails.money==0?'none':projectDetails.money=='不设目标'?'none':'inline-block'}}>元</span></li>
                        <li><b>已捐款金额</b>
                            <span>0</span>元</li>
                        <li><b>捐款人次</b>
                            <span>0</span>人</li>
                    </ul>
                </div>
                <h2 className="originatingInstitution" ref="originatingInstitution">
                    发起机构
                </h2>
                <div className="groupIntroduce">
                    <span className="attentionBtn">+关注</span>
                    <div className="left groupShowImg">
                        <img src="img/groupShow.png" alt=""/>
                    </div>
                    <div className="left group-message">
                        <h3>某某机构</h3>
                        <div className="groupStar">
                            <div className="groupStart-title">机构星级</div>
                            <div className="groupStart-img">
                                <img src="img/whiteStar.png" />
                                <img src="img/whiteStar.png" />
                                <img src="img/whiteStar.png" />
                                <img src="img/whiteStar.png" />
                                <img src="img/whiteStar.png" />
                            </div>
                        </div>
                        <div className="groupDescription">
                            机构信息
                        </div>
                    </div>
                </div>
                <ul className="project-item">
                    <li>项目介绍</li>
                    <li>项目进展</li>
                    <li>爱心互动</li>
                </ul>
                <div className="project-detail">

                </div>
            </div>)
        </div>)

    }
    componentDidMount(){

    }
    wheelSize(e){
       let bottom = $(this.refs.projectPreviewBox).scrollTop();
        $(this.refs.previewBottom).css('bottom',-bottom);
    }
}
