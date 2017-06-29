import React from 'react';
import {getQueryString,isVal} from '../../commonEvent';


export default class SubmitAudit extends React.Component{
    constructor(){
        super()
        this.state = {
            liable:"某某某",
            status:"已经提交",
            auditMessage:"感谢您的积极配合与理解~1-3个工作日内将完成审核",
            isHide:{
                display:'none'
            }
        }
    }
    render(){
        return(
            <div className="registerClassify">
                <div className="submitSuccess">
                    <img src="img/submitSuccess.png" alt="" className="left submitSuccessPicture" ref="submitSuccessPicture"/>
                    <div className="submitSuccessWord left">
                        <h2>{this.state.liable}，您的审核信息{this.state.status}</h2>
                        <p>{this.state.auditMessage}</p>
                        <a href="#userMessage" style={this.state.isHide}>返回修改</a>
                    </div>
                </div>
            </div>
        )
    }
    componentDidMount(){
        let obj = getQueryString();
        if(obj==""||obj=="{}"||obj=="undefined"||obj==null){
            let liable = JSON.parse(sessionStorage.getItem("userMessage")).liable;
            this.setState({
                liable:liable
            })
        }else{
            if(obj.status==2){
                this.setState({
                    liable:obj.liable,
                    status:"已提交"
                })
            }else if(obj.status==1){
                this.setState({
                    liable:obj.liable,
                    status:"未通过！",
                    auditMessage:"未通过原因："+obj.reason,
                    isHide:{
                        display:'block'
                    }

                })
                this.refs.submitSuccessPicture.src='img/loginError.png'
            }else{
                let liable = JSON.parse(sessionStorage.getItem("userMessage")).liable;
                this.setState({
                    liable:liable
                },function(){
                    sessionStorage.removeItem('contactMessage');
                    sessionStorage.removeItem('institutionMessage');
                    sessionStorage.removeItem('userMessage');
                    let userMessage = {};
                    userMessage.liable = this.state.liable;
                    sessionStorage.setItem("userMessage",JSON.stringify(userMessage))
                })
            }
        }
    }
}