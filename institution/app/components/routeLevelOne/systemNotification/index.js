import React from 'react';
import {sendAjax,getPageArray} from '../../../../lib/commonEvent';
import './index.less';
export default class systemNotification extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'items':[],
            'pageNumber':[],
            'pageNow':'',
            pageAll:1,
            nowMessage:{},
            messageId:-1
        }
    }
    render(){
        return (
            <div style={{position:"relative"}} id="systemNotification">
                <div id="deleteMessageBox">
                    <div id="isDeleteMessage">
                       <p>删除后无法找回</p>
                        <p>请慎重操作</p>
                    </div>
                    <div id="isSure">
                        <span id="isOk" onClick={this.deleteThisOne.bind(this)}>确定</span>
                        <span onClick={this.cancelDelete.bind(this)}>取消</span>
                    </div>
                </div>
                <div id="showMessageBox">
                    <h3>消息详情</h3>
                    <div id="messageContentBox" style={{}}>
                        {this.state.nowMessage.message}
                    </div>
                    <p id="messageTime">{this.state.nowMessage.created_at}</p>
                    <div id="closeMessageBox" onClick={this.closeMessageBox.bind(this)}>
                        关闭
                    </div>
                </div>
                <div className="checkAll" style={{margin:'20px 0 10px 0'}}>
                    <div className="activeItemsCheckGather" style={{backgroundImage:'none'}}>消息通知</div>
                </div>
                <div id="systemNotificationList" style={{clear:'both'}}>
                    {
                        this.state.items.map(function(item,i){
                            return(<div className="perMessage" key={i}>
                                <a className="messageContent"><span className="isRead" style={{display:item.read==0?'inline-block':'none'}}>*</span>{item.message}</a>
                                <br/>
                                <span className="messsageTime">{item.created_at}</span>
                                <div className="messageOperate">
                                    <a href="javascript:;" className="check" onClick={this.checkMessage.bind(this,item.id)}><img src="./img/check.png" alt=""/>查看</a>
                                    <a href="javascript:;" onClick={this.deleteMessage.bind(this,item.id)}><img src="./img/trashCan.jpg"  alt=""/>删除</a>
                                </div>
                            </div>)
                        }.bind(this))
                    }
                </div>
                <div className="pageList" style={{position:'relative',top:'0',left:'0',marginBottom:'20px'}}>
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
            </div>
        )
    }
    componentDidMount(){
        this.getInformation();
    }
    getInformation(page,keyWord){
        let token = sessionStorage.getItem('token');
        page = page || 0;
        keyWord = keyWord || '';
        let that = this;
        sendAjax({
            type:"POST",
            url:"admin/leaving/message/findGroupMessageList",
            data:{
                token:token,
                page:page,
                search:keyWord,
                limit:5
            },
            success:function(data){
                if(data.code == 200){
                    if(data.pageAll==0){
                        that.setState({
                            pageNow:"0"
                        })
                    }
                    let newArray = getPageArray(page+1,data.pageAll,5);
                    that.setState({
                        items:data.messageList
                    },function(){
                        that.setState({
                            pageNumber:newArray,
                            pageAll:data.pageAll
                        },function(){
                            $.each($('.pageContainer').find('li'),function(index,item){
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
    //查看消息
    checkMessage(id,event,self){
        let token = sessionStorage.getItem('token');
        let that = this;
        let e = event || window.event;
        let mySelf =  $(e.target);
        sendAjax({
            type:'POST',
            url:'admin/leaving/message/findGroupMessage',
            data:{
                token:token,
                id:id
            },
            success:function(data){
                if(data.code==200){
                    that.setState({
                        nowMessage:data.groupMessage
                    },function(){
                        mySelf.parent('.messageOperate').siblings('.messageContent').find('.isRead').hide();
                        $('#coverBox').css({
                            'height':document.body.scrollHeight+'px'
                        }).show();
                        $('#showMessageBox').show();
                    })
                }
            }
        })
    }
    //关闭详情
    closeMessageBox(){
        $('#showMessageBox').hide();
        $('#coverBox').hide();
    }
    //弹出删除框
    deleteMessage(id){
        $('#coverBox').css({
            'height':document.body.scrollHeight+'px'
        }).show();
        $("#deleteMessageBox").show();
        this.setState({
            messageId:id
        })
    }
    //取消删除框
    cancelDelete(){
        $('#coverBox').hide();
        $("#deleteMessageBox").hide();
    }
    //确定删除信息
    deleteThisOne(){
        let token = sessionStorage.getItem('token');
        $('#coverBox').hide();
        $("#deleteMessageBox").hide();
        let id = this.state.messageId;
        sendAjax({
            type:'POST',
            url:'admin/leaving/message/deleteGroupMessage',
            data:{
                token:token,
                id:id
            },
            success:function(data){
                if(data.code==200){
                    window.location.reload();
                }
            }
        })
    }
    componentWillReceiveProps(nextProps){
        this.getInformation(0,nextProps.keyWord)

    }
    changePage(page,e){
        if(page<0){
            return;
        }
        //改变样式
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'});
        //获取数据
        this.getInformation(page,this.props.keyWord);
        this.setState({
            pageNow:page+1
        })
    }
    jumpToFirst(){
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        this.getInformation(0,this.props.keyWord);
        if(this.state.pageAll!=0){
            this.setState({
                pageNow:1
            })
        }
    }
    jumpToLast(){
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        this.getInformation(this.state.pageAll-1,this.props.keyWord);
        this.setState({
            pageNow:this.state.pageNumber.length
        })
    }
    jumpToPages(){
        $('.pageContainer').find('li').css({'background':'#fff','color':'#000'})
        let page = this.refs.jumpToPages.value;
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

