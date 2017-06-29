import React from 'react';
import {sendAjax,getPageArray} from '../../../../../../../lib/commonEvent'

export default class EnrollList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'pageNumber':[],
            'pageNow':0,
            pageAll:1,
            items:[],
            activityId:''
        }
    }
    render(){
        return(<div id="enrollList" style={this.props.hideStyle}>
            <div className="backBtn" >
                <span onClick={this.backList.bind(this)}>线下活动</span>
                <span className="noChange">></span>
                <span onClick={this.backActivityDetail.bind(this)}>活动详情</span>
                <span className="noChange">></span>
                <span>线上报名表</span>
            </div>
            <table className="checkedList" cellSpacing = '0'>
                <thead>
                <tr>
                    {/*<th>
                     <input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>
                     </th>*/}
                    <th>排序</th>
                    <th>报名日期</th>
                    <th>真实姓名</th>
                    <th>性别</th>
                    <th>证件号</th>
                    <th>联系电话</th>
                    <th>工作单位</th>
                    <th>职位</th>
                    <th>项目支持</th>
                    <th>备注</th>
                </tr>
                </thead>
                <tbody>
                {
                    this.state.items.map(function(item,index){
                        return (
                            <tr key={index}>
                                {/*<td>
                                 <input type="checkbox" className="tick" onClick={this.tickOrNot.bind(this)} data-id={item.id}/>
                                 </td>*/}
                                <td>{index+1}</td>
                                <td>{item.created_at}</td>
                                <td>{item.applicant}</td>
                                <td>{item.sex==1?"女":"男"}</td>
                                <td>{item.id_number}</td>
                                <td>{item.mobile}</td>
                                <td>{item.work?item.work:'-'}</td>
                                <td>{item.position?item.position:'-'}</td>
                                <td>{item.project?item.project:'-'}</td>
                                <td className="enrollRemarks" title={item.remarks}>{item.remarks?item.remarks:'-'}</td>
                            </tr>
                        )
                    }.bind(this))
                }
                </tbody>
            </table>
            <div className="pageList">
                 <div className="firstAndLast" onClick={this.jumpToFirst.bind(this)}>首页</div>
                 <div className="pageContainer">
                     <ul>
                     {
                     this.state.pageNumber.map(function(item,index){
                     return(
                         <li key={index}  onClick={this.changePage.bind(this,(item.pageNo-1))} data-flag={item.pageNo-1}>{item.pageName}</li>
                     )
                      }.bind(this))
                     }
                     </ul>
                 </div>
                 <div className="firstAndLast" onClick={this.jumpToLast.bind(this)}>尾页</div>
                 <div className="pageCount">
                     <span>第{this.state.pageNow}页</span>/
                     <span>共{this.state.pageAll}页</span>
                 </div>
                 <div className="jumpTo">
                     <input type='number' ref="jumpToPages" min="1"/>
                     <span onClick={this.jumpToPages.bind(this)}>跳转</span>
                 </div>
             </div>
        </div>)
    }
    componentDidMount(){

    }
    componentWillReceiveProps(nextProps){
        this.setState({
            activityId:nextProps.status
        })
        if(nextProps.keyWord!=''|| nextProps.status!=0){
            this.getEnrollList(nextProps.status,0,nextProps.keyWord);
        }
    }
    getEnrollList(activityId,page,search){
        let token = sessionStorage.getItem('token');
        let self = this;
        page = page || 0;
        search = search || ''
        sendAjax({
            type:"POST",
            url:"admin/activity/findActivityRegisters",
            data:{
                token:token,
                activityId:activityId,
                page:page,
                search:search
            },
            success:function(data){
                if(data.code==200){
                    let newArray = getPageArray(page+1,data.pageAll,10);
                    if(data.pageAll==0){
                        self.setState({
                            pageNow:0
                        })
                    }
                    self.setState({
                        items:data.activityRegisterList
                    },function(){
                        self.setState({
                            pageNumber:newArray,
                            pageAll:data.pageAll
                        },function(){
                            $.each($('.pageContainer').find('li'),function(index,item){
                                $(item).css({'background':'#fff','color':'#000'});
                                if($(item).attr('data-flag')==page){
                                    $(item).css({'background':'#e7503d','color':'#fff'});
                                    self.setState({
                                        pageNow:Number(page+1)
                                    })
                                }
                            })
                        })
                    })
                }
            }
        })
    }
    backList(){
        $("#activeList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#compile").addClass("hideItems");
        $("#exportEnroll,#putInEnroll").addClass("hideItems");
        this.props.callbackParent(0);
        this.props.isIndex(1);
    }
    backActivityDetail(){
        $("#activeInfo").show().siblings().hide();
        $(".checkAll").siblings().addClass("hideItems");
        $("#compile").removeClass("hideItems");
    }
    changePage(page,e){
        if(page<0){
            return;
        }
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        //获取数据
        this.getEnrollList(this.props.status,page,this.props.keyWord);
        this.setState({
            pageNow:page+1
        })
    }
    jumpToFirst(){
        this.getEnrollList(this.props.status,0,this.props.keyWord);
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        if(this.state.pageAll!=0){
            this.setState({
                pageNow:1
            })
        }
    }
    jumpToLast(){
        this.getEnrollList(this.props.status,this.state.pageAll-1,this.props.keyWord);
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        this.setState({
            pageNow:this.state.pageAll
        })
    }
    jumpToPages(){
        let page = this.refs.jumpToPages.value;
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        if(page!=''){
            if(page>0&&page<=this.state.pageAll){
                this.getEnrollList(this.props.status,page-1,this.props.keyWord);
                this.setState({
                    pageNow:page
                })
            }
        }
    }
}