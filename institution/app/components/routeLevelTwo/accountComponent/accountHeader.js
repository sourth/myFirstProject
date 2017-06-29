import React from 'react';
import {Link} from 'react-router';

export default class AccountHeader extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            witchAddHash:"/account/addAccount",
            isShowSearch:'block',
            isShowAdd:'block'
        }
    }
    render(){
        return(
            <div id="userHeader">
                <div className="bannerBar" style={{overflow:'hidden',margin:'10px 0'}}>
                    <div className="checkAll">
                        <div className="activeItemsCheckGather" style={{backgroundImage:'none'}}>账号管理</div>
                    </div>
                    <form style={{marginLeft:'30%',display:this.state.isShowSearch}}>
                        <input type="text" placeholder="请输入关键字" className="bannerKeyWords keyWords"/>
                        <h2 className="bannerSearch search">
                            <img src="img/search.jpg" onClick = {this.props.searchAccount}/>
                        </h2>
                    </form>
                    {/*<div className="delete" onClick={this.deleteItems.bind(this)}>删除</div>*/}
                     <div id="addAccountBtn" className="addNewSth" style={{display:this.state.isShowAdd}}><Link to={this.state.witchAddHash}>新增</Link></div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        window.onload = window.onhashchange=function(){
            let hash = window.location.hash;
            if(hash=='#/account'|| hash=='#/account/accountList'){
                self.setState({
                    witchAddHash:"/account/addAccount",
                    isShowSearch:'block',
                    isShowAdd:'block'
                })
            }else if(hash.indexOf('#/account/addAccount')!=-1 || hash.indexOf('#/account/addRole')!=-1){
                self.setState({
                    isShowSearch:'none',
                    isShowAdd:'none'
                })
            }else if(hash=='#/account/roleList'){
                self.setState({
                    witchAddHash:"/account/addRole",
                    isShowSearch:'block',
                    isShowAdd:'block'
                })
            }
        }
    }
    deleteItems(){
        if($('.tick').is(':checked')){
            $('#coverView').css('display','block');
        }
    }
}