import React from 'react';
import {sendAjax,getPageArray,isVal} from '../../../../../lib/commonEvent';
import {city} from '../../../../../lib/city';
import './index.less';
export default class DonationList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'items':[{data:'2012'}],
            'checkStatus':[],
            'id':0,
            'pageNumber':[],
            'pageNow':0,
            pageAll:1,
            total:0,
            surplus:0,
            pickUp:0,
            donationStatics:[],
            withdrawList:[],
        }
    }
    render(){
        return (
            <div id="donationList" style={{position:"relative"}}>
                <div className="donationData">
                    <div className="donationModel donationTotal">
                        <span className="model1">善款总金额：</span>
                        <span className="model2">{this.state.donationStatics.moneyAll?this.state.donationStatics.moneyAll:'0'}元</span>
                    </div>
                    <div className="donationModel donationSurplus">
                        <span className="model1">可提取金额：</span>
                        <span className="model2">{this.state.donationStatics.moneyCanWithdraw}元</span>
                    </div>
                    <div className="donationModel donationPickUp">
                        <span className="model1">已提取金额：</span>
                        <span className="model2">{this.state.donationStatics.moneyWithdrawed}元</span>
                    </div>
                </div>
               <div className="tableContainer">
                   <table className="checkedList" cellSpacing = '0'>
                       <thead>
                       <tr>
                           {/*<th>
                            <input type="checkbox" id="tickAll" onClick={this.changeStyle.bind(this)}/>
                            </th>*/}
                           <th>排序</th>
                           <th>日期</th>
                           <th>活动/项目名称</th>
                           {/*<th>状态</th>*/}
                           <th>活动/项目总额</th>
                           <th>提取金额</th>
                           <th>剩余款</th>
                           <th>提取人</th>
                           <th>手机号</th>
                           <th>开户姓名</th>
                           <th>银行卡号</th>
                           <th>开户银行</th>
                           <th>资金接收单</th>
                           <th>发票票据</th>
                           <th>快递单号</th>
                           <th>状态</th>
                           <th>原因</th>
                           <th>查看详情</th>
                       </tr>
                       </thead>
                       <tbody>
                       {
                           this.state.withdrawList.map(function(item,index){
                               return (
                                   <tr key={index}>
                                       {/*<td>
                                        <input type="checkbox" className="tick" onClick={this.tickOrNot.bind(this)} data-id={item.id}/>
                                        </td>*/}
                                       <td>{index+1}</td>
                                       <td>{item.created_at}</td>
                                       <td>{item.title}</td>
                                       {/*<td>{item.status==2?'未通过':item.status==1?'通过':'待审核'}</td>*/}
                                       <td>{item.total_money?item.total_money:0}</td>
                                       <td>{item.money}/{item.ratio*100+'%'}</td>
                                       <td>{item.balance?item.balance:'0.00'}</td>
                                       <td>{item.contact}</td>
                                       <td>{item.mobile}</td>
                                       <td>{item.account}</td>
                                       <td>{item.bank_number}</td>
                                       <td>{item.bank_name}</td>
                                       <td><a href={item.funds_receipt?item.funds_receipt:'javascript:;'} style={{color:'#333'}} className="underLine" target="_blank">{item.funds_receipt?'查看':'未上传'}</a></td>
                                       <td><a href={item.receipt?item.receipt:'javascript:;'} style={{color:'#333'}} className="underLine" target="_blank">{item.receipt?'查看':'未上传'}</a></td>
                                       <td>{item.express_number?item.express_number:'未填写'}</td>
                                       <td>{item.status==2?'拒绝':item.status==1?'通过':'待审核'}</td>
                                       <td title={item.reason} className="donationReason">{item.reason?item.reason:'无'}</td>
                                       <td onClick={this.showDonationDetails.bind(this,item.id)} className='cursorPointer'>查看</td>
                                   </tr>
                               )
                           }.bind(this))
                       }
                       </tbody>
                   </table>
               </div>
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
            </div>
        )
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.keyWord!=''|| nextProps.status==0){
            this.getInformation(0,nextProps.keyWord);
        }
    }
    componentDidMount(){
        this.getInformation();
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
                self.getInformation(0,$('.keyWords').val());
            }
        }
    }
    showDonationDetails(id,self){
        $('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
        $('.operationBar').css('overflow','hidden');
        $('.activeItemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
        $('#donationInfo').css('display','block').siblings().css('display','none');
        this.props.callBackDonationId(id);
    }
    getInformation(page,title){
        let token = sessionStorage.getItem('token');
        page = page || 0;
        title = title || '';
        let that = this;
        sendAjax({
            type:"POST",
            url:"admin/withdraw/findWithdrawList",
            data:{
                token:token,
                page:page,
                search:title
            },
            success:function(data){
                if(data.code==200){
                    let newArray = getPageArray(page+1,data.pageAll,10);
                    if(data.pageAll==0){
                        that.setState({
                            pageNow:0
                        })
                    }
                    that.setState({
                        donationStatics:data.donationStatics,
                        withdrawList:data.withdrawList
                    },function(){
                        that.setState({
                            pageNumber:newArray,
                            pageAll:data.pageAll
                        },function(){
                            $.each($('.pageContainer').find('li'),function(index,item){
                                $(item).css({'background':'#fff','color':'#000'})
                                if($(item).attr('data-flag')==page){
                                    $(item).css({'background':'#e7503d','color':'#fff'});
                                    that.setState({
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
    changeStyle(e){
        let status = e.target.checked;
        $('.tick').each(function(){
            this.checked = status
        })
    }
    tickOrNot(e){
        let count = 0;
        $('.tick').each(function(index,el){
            if($(el).is(':checked')){
                return;
            }else{
                count++
            }
        });
        if($('.tick').length == count){
            $('#tickAll')[0].checked = false;
        };
    }
    changeHeaderStyle(){
        $('.itemsCheckGather').css('background','#e7503d');
        $('.checkAll').siblings().addClass('hideItems');
        $("#compile").removeClass("hideItems")
        $('.checkAll').children('ul').addClass('hideItems');
    }
    check(e){
        let that = this;
        let token = sessionStorage.getItem('token');
        let id = $(e.target).attr('data-id');
        $('.checkAll').css('overflow','hidden').siblings().addClass('hideItems');
        $('.operationBar').css('overflow','hidden');
        $('.itemsCheckGather').css('background','#e7503d').siblings().addClass('hideItems');
        $('#activeInfo').css('display','block').siblings().css('display','none');
        this.changeHeaderStyle();
        this.props.callbackParent(id);
        this.props.postActivityId(id);
    }
    changePage(page,e){
        if(page<0){
            return;
        }
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        //获取数据
        this.getInformation(page,this.props.keyWord);
        this.setState({
            pageNow:page+1
        })
    }
    jumpToFirst(){
        this.getInformation(0,this.props.keyWord);
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        if(this.state.pageAll!=0){
            this.setState({
                pageNow:1
            })
        }
    }
    jumpToLast(){
        this.getInformation(this.state.pageAll-1,this.props.keyWord);
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
                this.getInformation(page-1,this.props.keyWord);
                this.setState({
                    pageNow:page
                })
            }
        }
    }
}