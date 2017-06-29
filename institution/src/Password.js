/**
 * Created by zn on 2017/6/13.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import '../styles/reset.less';
import '../styles/password.less';
import {sendAjax,getQueryString,isPassword} from '../lib/commonEvent'

export default class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            isCodeTime: '发送验证码',
            mobile:'***********',
            status:0
        }
    }
    render(){
        return(<div id="repairPassword" ref="repairPassword">
            <div className="loginLogo">
                <div className="logoContainer">
                    <img src="img/logo.png" alt="logo" />
                </div>
            </div>
            <div className="passwordContent">
                <div id="passwordContentList">
                    <a className={this.state.status==0?'passwordActive':''}><span className="passwordWays">1</span>确认身份</a>
                    <a  className={this.state.status==1?'passwordActive':''}><span className="passwordWays">2</span>验证手机号</a>
                    <a  className={this.state.status==2?'passwordActive':''}><span className="passwordWays">3</span>重置登录密码</a>
                    <a  className={this.state.status==3?'passwordActive':''}><span className="passwordWays">4</span>重置成功</a>
                </div>
                <div className="passwordModel" style={{display:this.state.status==0?'block':'none'}}>
                    <div className="passwordBox">
                        <span className="passwordLeft">登录账号</span>
                        <div className="passwordRight">
                            <input type="text" ref="name" onKeyUp={this.keyShowMobile.bind(this)}/>
                        </div>
                    </div>
                    <div className="nextStep" onClick={this.showMobile.bind(this)}>
                        下一步
                    </div>
                </div>
                <div className="passwordModel" style={{display:this.state.status==1?'block':'none'}}>
                    <div className="passwordBox" style={{marginBottom:'20px'}}>
                        <span className="passwordLeft">手机号</span>
                        <div className="passwordRight">
                            <span style={{borderRight:'0',width:'59%'}}>{this.state.mobile}</span>
                            <span style={{borderLeft:'0',width:'40%',textAlign:'center',cursor:'pointer'}} onClick={this.getCode.bind(this)}> <b></b>{this.state.isCodeTime}</span>
                        </div>
                    </div>
                    <div className="passwordBox">
                        <span className="passwordLeft">验证码</span>
                        <div className="passwordRight">
                            <input type="text" ref="code" onKeyUp={this.keyCheckCode.bind(this)}/>
                        </div>
                    </div>
                    <div className="nextStep" onClick={this.checkCode.bind(this)}>
                        下一步
                    </div>
                </div>
                <div className="passwordModel" style={{display:this.state.status==2?'block':'none'}}>
                    <div className="passwordBox" style={{marginBottom:'20px'}}>
                        <span className="passwordLeft">新密码</span>
                        <div className="passwordRight">
                            <input type="password" ref="password" onBlur={this.isPassword.bind(this)}/>
                        </div>
                    </div>
                    <div className="passwordBox">
                        <span className="passwordLeft">确认新密码</span>
                        <div className="passwordRight">
                            <input type="password" ref="newPassword" onChange={this.isHavePassword.bind(this)} onKeyUp={this.keySendMessage.bind(this)}/>
                        </div>
                    </div>
                    <div className="nextStep" onClick={this.sendMessage.bind(this)}>
                        下一步
                    </div>
                </div>
                <div className="passwordModel" style={{display:this.state.status==3?'block':'none'}}>
                   <div className="submitSuccess">
                       密码重置成功
                   </div>
                    <div className="nextStep" onClick={this.backLogin.bind(this)} style={{width:'270px'}}>
                        返回登录
                    </div>
                </div>
            </div>
        </div>)
    }
    componentDidMount(){
        let obj = getQueryString();
        if(obj.groupName){
            this.refs.name.value = obj.groupName
        }
    }
    //验证密码是否符合规则
    isPassword(e){
        e = e || window.evnet;
        let value = e.target.value;
        if(!isPassword(value)){
            alert('密码由6-13位数字和字母组成！');
            e.target.value='';
        }
    }
    isHavePassword(){
        if(this.refs.password.value==''){
            alert('新密码不能为空！')
            this.refs.newPassword.value=''
        }
    }
    //enter键检验验证码是否正确
    keyCheckCode(event){
        let e = event || window.event || arguments.callee.caller.arguments[0];
        if(e&&e.keyCode==13){
            this.checkCode();
        }
    }
    //检测验证码是否正确
    checkCode(){
        let self = this;
        let name = this.refs.name.value;
        if(name==''){
            alert('账号不能为空！');
            return;
        }
        let code = this.refs.code.value;
        if(code==''){
            alert('验证码不能为空！');
            return;
        }
        sendAjax({
            type:'POST',
            url:'adminLogin/checkcaptcha',
            data:{
                name:name,
                code:code
            },
            success:function(data){
                if(data.code==200){
                    self.setState({
                        status:2
                    })
                }else if(data.code==201){
                    alert('系统错误！');
                }else if(data.code==204){
                    alert('账号错误！');
                }else if(data.code==205){
                    alert('验证码错误！');
                }else if(data.code==206){
                    alert('参数错误！');
                }else if(data.code==207){
                    alert('验证码失效！');
                }else{
                    alert(data.message)
                }
            }
        })
    }
    //enter键显示手机号
    keyShowMobile(event){
        let e = event || window.event || arguments.callee.caller.arguments[0];
        	if(e&&e.keyCode==13){
        		this.showMobile();
        	}
    }
    //显示手机号
    showMobile(){
        let self = this;
        let groupName = self.refs.name.value;
        if(groupName==''){
            alert('账号不能为空！');
            return;
        }
        sendAjax({
            type:'POST',
            url:'adminLogin/mobile',
            data:{
                name:groupName
            },
            success:function(data){
                if(data.code==200){
                    self.setState({
                        mobile:data.message.mobile,
                        status:1
                    })
                }else if(data.code==201){
                    alert('该账号无法找回密码，请联系最高管理员！')
                }else{
                    alert('该账号不存在！')
                }
            }
        })
    }
    //获取验证码
    getCode() {
        let self = this;
        let groupName = self.refs.name.value;
        if(groupName==''){
            alert('账号不能为空！');
            return;
        }
        if(this.state.isCodeTime=='发送验证码'){
            sendAjax({
                type:"POST",
                url:"adminLogin/password",
                data:{
                    name:groupName
                },
                success:function(res) {
                    if(res.code==200) {

                        //alert('验证码已发送，请注意接收！')
                    }else{
                        alert(res.message)
                    }
                }
            })
            // 60秒时间读秒
            let timeNum = 60;
            let timer = setInterval(function() {
                timeNum--;
                if(timeNum<10&&timeNum>0) {
                    timeNum = "0"+timeNum;
                }
                self.setState({
                    isCodeTime:timeNum+'s'
                })
                if(timeNum <= 0){
                    clearInterval(timer);
                    self.setState({
                        isCodeTime:'发送验证码'
                    })
                }
            },1000)
        }
    }
    //enter键提交修改
    keySendMessage(event){
        let e = event || window.event || arguments.callee.caller.arguments[0];
        if(e&&e.keyCode==13){
            this.sendMessage();
        }
    }
    //提交修改
    sendMessage(){
        let self = this;
        let sendData = {}
        let groupName = self.refs.name.value;
        if(groupName==''){
            alert('账号不能为空！');
            return;
        }
        sendData.name = groupName;
        let password = self.refs.password.value;
        if(password==''){
            alert('新密码不能为空！');
            return;
        }
        let newPassword = this.refs.newPassword.value;
        if(newPassword==''){
            alert('确认密码不能为空！');
            return;
        }
        if(password!=newPassword){
            alert('俩次密码不一致，请重新填写！');
            this.refs.newPassword.value = '';
           return;
        }
        sendData.password = password;
        let code = self.refs.code.value;
        if(code==''){
            alert('验证码不能为空！');
            return;
        }
        sendData.code = code;
        sendAjax({
            type:'POST',
            url:'adminLogin/editpassword',
            data:sendData,
            success:function(data){
                if(data.code==200){
                    self.setState({
                        status:3
                    })
                }else if(data.code==204){
                    alert('账号错误！')
                }else if(data.code==205){
                    alert('验证码错误！');
                }else if(data.code==207){
                    alert('验证码实效！');
                }else{
                    alert(data.message);
                }
            }
        })
    }
    backLogin(){
        window.location.href='index.html';
    }
}

ReactDOM.render(
   <App />
,document.getElementById("index"))