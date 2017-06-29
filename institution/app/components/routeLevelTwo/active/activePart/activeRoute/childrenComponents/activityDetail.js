/**
 * Created by Rockwill-html on 2017/5/27.
 */
//项目预览，项目详情
import React from 'react';
import './activityDetail.less'

export default class ActivityDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {};
    }
    render(){
        let activityDetails = this.props.previewInformation;
        if(activityDetails.content!=''&&activityDetails.content!=undefined){
            $('.activity-detail').html(activityDetails.content)
        }
        return(
            <div className="activityPreviewContainer">
                <div id="activityPreviewBox" onScroll={this.wheelSize.bind(this)} ref="activityPreviewBox">
                    <div className="activityDetBan">
                        <img src={activityDetails.banner} alt="" className="activityDetail_banner"/>
                    </div>
                    <div className="activityPreviewBottom" ref="activityPreviewBottom">
                        <span>我要报名</span>
                    </div>
                    <div className="activeFinish" style={{background:"#fff"}}>
                        <p className="activeTitle"><i className="activeTitleContent">{activityDetails.title}</i></p>
                        <div className="activeLine"></div>
                        <p className="activeEnd"><span >已完成<i>0%</i></span></p>
                    </div>
                    <div className="collect-header-activity" style={{background:"#fff"}}>
                        <ul>
                            <li><b>招募人数</b>
                                <span>{activityDetails.number}</span>人
                            </li>
                            <li><b>已报名人数</b>
                                <span>0</span>人
                            </li>
                        </ul>
                    </div>
                    <div className="activity-message">
                        <div className="group-name">
                            <span className="left">机构名称</span>
                            <span className="right">某某机构</span>
                        </div>
                        <div>
                            <span className="left">活动费用</span>
                            <span className="right">{activityDetails.charge==0?'免费':activityDetails.charge+'元'}</span>
                        </div>
                        <div>
                            <span className="left">活动时间</span>
                            <span className="right">{activityDetails.end_time}</span>
                        </div>
                        <div>
                            <span className="left">活动简介</span>
                            <span className="right">{activityDetails.description}</span>
                        </div>
                        <div>
                            <span className="left">活动地址</span>
                            <span className="right">{activityDetails.location}</span>
                        </div>
                    </div>
                    <ul className="activity-item">
                        <li>活动介绍</li>
                        <li>志愿互动</li>
                    </ul>
                    <div className="activity-detail">

                    </div>
                </div>
            </div>
           )
    }
    wheelSize(e){
        let bottom = $(this.refs.activityPreviewBox).scrollTop();
        $(this.refs.activityPreviewBottom).css('bottom',-bottom);
    }
}
