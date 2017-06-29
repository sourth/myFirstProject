import React from 'react';
import {sendAjax,getPageArray} from '../../../../../../../lib/commonEvent'
let token = sessionStorage.getItem('token');

export default class DonateMoneyList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'pageNumber':[],
            'pageNow':'',
            pageAll:1,
            items:[]
        }
    }
    render(){
        return(<div id="donateMoneyList" style={this.props.hideStyle}>
            <div className="backBtn" >
                <span onClick={this.backList.bind(this)}>募捐项目</span>
                <span className="noChange">></span>
                <span onClick={this.backProjectDetail.bind(this)}>项目详情</span>
                <span className="noChange">></span>
                <span>捐款明细</span>
            </div>
            <table className="checkedList" cellSpacing = '0'>
                <thead>
                <tr>
                    {/*<th>
                     <input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>
                     </th>*/}
                    <th>排序</th>
                    <th>捐款时间</th>
                    <th>昵称</th>
                    <th>捐赠金额</th>
                    <th>配捐金额</th>
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
                                <td>{item.time}</td>
                                <td>{item.name}</td>
                                <td>{item.total}</td>
                                <td>{item.donation?item.donation:'-'}</td>
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
                     <span>第{this.state.pageNow == ''?1:this.state.pageNow}页</span>/
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
       if(nextProps.status!=0){
           this.getDonateMoneyList(nextProps.status);
       }
    }
    getDonateMoneyList(projectId,page){
       let self = this;
        page = page || 0;
        sendAjax({
            type:"POST",
            url:"admin/project/findDonor",
            data:{
                token:token,
                projectId:projectId,
                page:page
            },
            success:function(data){
                if(data.code==200){
                    if(data.count==0){
                        self.setState({
                            pageNow:"0"
                        })
                    }
                    let newArray = getPageArray(page+1,data.count,10);
                    self.setState({
                        items:data.message
                    },function(){
                        self.setState({
                            pageNumber:newArray,
                            pageAll:data.count
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
        $("#projectList").show().siblings().hide();
        $(".checkAll").siblings().removeClass("hideItems");
        $("#compile").addClass('hideItems');
        this.props.callbackParent(0);
    }
    backProjectDetail(){
        $("#projectInfo").show().siblings().hide();
        $(".checkAll").siblings().addClass("hideItems");
        $("#compile").removeClass("hideItems");
    }
    changePage(page,e){
        if(page<0){
            return;
        }
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        //获取数据
        this.getDonateMoneyList(this.props.status,page,this.props.projectTitle);
        this.setState({
            pageNow:page+1
        })
    }
    jumpToFirst(){
        this.getInformation(this.props.status,0,this.props.projectTitle);
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        if(this.state.pageAll!=0){
            this.setState({
                pageNow:1
            })
        }
    }
    jumpToLast(){
        this.getInformation(this.props.status,this.state.pageAll-1,this.props.projectTitle);
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
                this.getInformation(this.props.status,page-1,this.props.projectTitle);
                this.setState({
                    pageNow:page
                })
            }
        }
    }
}
