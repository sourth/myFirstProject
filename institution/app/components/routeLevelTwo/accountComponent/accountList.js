import React from 'react';
import {sendAjax,getPageArray,isVal} from '../../../../lib/commonEvent';

export default class AccountList extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            'items':[],
            'pageNumber':[],
            'pageNow':'',
            pageAll:1,
            id:-1
        }
    }
    render(){
        return (
            <div style={{position:"relative"}}>
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
                <div id="userList">
                    <table className="checkedList userListTable" cellSpacing = '0'>
                        <thead>
                        <tr>
                            <th>排序</th>
                            <th>用户名</th>
                            <th>密码</th>
                            <th>真实姓名</th>
                            <th>角色</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.items.map(function(item,index){
                                return (
                                    <tr key={index}>
                                        <td>{index+1}</td>
                                        <td>{item.name}</td>
                                        <td>******</td>
                                        <td>{item.realname}</td>
                                        <td>{item.rolename?item.rolename:'最高管理员'}</td>
                                        <td className="accountOperate"><a style={{color:'#333'}} href={"#/account/addAccount?id="+item.id}>编辑</a>|<span onClick={this.forbiddenAccount.bind(this,item.id,item.disable)}>{item.disable==0?'禁用':'启用'}</span>|<span onClick={this.deleteAccount.bind(this,item.id,item.rolename)}>删除</span></td>
                                    </tr>
                                )
                            }.bind(this))
                        }
                        </tbody>
                    </table>
                </div>
                <div className="pageList" >
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
    //禁用账户
    forbiddenAccount(id,disabled,event){
        let token = sessionStorage.getItem('token');
        event = event || window.event;
        let target = event.target;
        let state = 0;
        if(disabled=='0'){
            state = 1
        }
        sendAjax({
            type:'POST',
            url:'admin/account/editAdminDisable',
            data:{
                token:token,
                adminId:id,
                state:state
            },
            success:function(data){
                if(data.code==200){
                    if(disabled=='0'){
                        alert('禁用成功！');
                        window.location.reload();
                    }else{
                        alert('启用成功！');
                        window.location.reload();
                    }
                }
            }
        })
    }
    getInformation(page,keyWord){
        let token = sessionStorage.getItem('token');
        page = page || 0;
        keyWord = keyWord || '';
        let that = this;
        sendAjax({
            type:"POST",
            url:"admin/account/findAdminList",
            data:{
                token:token,
                page:page,
                search:keyWord
            },
            success:function(data){
                if(data.code == 200){
                    if(data.countList==0){
                        that.setState({
                            pageNow:"0"
                        })
                    }
                    let newArray = getPageArray(page+1,data.countList,10);
                    that.setState({
                        items:data.message
                    },function(){
                        that.setState({
                            pageNumber:newArray,
                            pageAll:data.countList
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
                }else if(data.code==204&&data.message=='NULL'){
                    that.setState({
                        items:[]
                    },function(){
                        that.setState({
                            pageNumber:[],
                            pageAll:0,
                            pageNow:"0"
                        })
                    })
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
    //弹出删除框
    deleteAccount(id,isFirst){
        if(isVal(isFirst)==''){
            alert('原始账号，不能删除！');
            return;
        }
        $('#coverBox').css({
            'height':document.body.scrollHeight+'px'
        }).show();
        $("#deleteMessageBox").show();
        this.setState({
            id:id
        })
    }
    //取消删除框
    cancelDelete(){
        $('#coverBox').hide();
        $("#deleteMessageBox").hide();
    }
    //确定删除账号
    deleteThisOne(){
        let token = sessionStorage.getItem('token');
        $('#coverBox').hide();
        $("#deleteMessageBox").hide();
        let id = this.state.id;
        sendAjax({
            type:'POST',
            url:'admin/account/deleteAdmin',
            data:{
                token:token,
                adminId:id
            },
            success:function(data){
                if(data.code==200){
                    window.location.reload();
                }else{
                    alert(data.message);
                }
            }
        })
    }
}
