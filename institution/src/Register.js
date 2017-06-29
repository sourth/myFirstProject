import React from 'react';
import ReactDOM from 'react-dom';
import {Route,Link,Router,IndexRoute,hashHistory} from 'react-router';
import {getQueryString} from '../lib/commonEvent';
import '../styles/reset.less';
import '../styles/Register.less';
import ContactWay from '../lib/RegisterComment/contactWay/index';
import InstitutionMessage from '../lib/RegisterComment/institutionMessage';
import SubmitAudit from '../lib/RegisterComment/submitAudit';
import UserMessage from '../lib/RegisterComment/userMessage';


export default class Index extends React.Component{
    constructor(){
        super()
        this.state = {
            isRepair:''
        }
    }
    render(){
        return(
            <div>
                <a href="index.html" className="login" target="_blank">登录</a>
                <div className="loginLogo">
                    <div className="logoContainer">
                        <img src="img/logo.png" alt="logo" />
                    </div>
                </div>
                <div className="registerContent">
                            <div id="registerContentList">
                                <Link to={this.state.isRepair==''?'userMessage':this.state.isRepair}  className="firstRout router cursorPointer" ><span className="registerWays">1</span>用户信息</Link>
                                <Link to={this.state.isRepair==''?'institutionMessage':this.state.isRepair}  className="secondRout router cursorPointer" ><span className="registerWays">2</span>机构信息</Link>
                                <Link to={this.state.isRepair==''?'contactWay':this.state.isRepair}  className="thirdRout router cursorPointer" ><span className="registerWays">3</span>联系方式</Link>
                                <Link  className="fourthRout router cursorPointer" ><span className="registerWays">4</span>审核提交</Link>
                            </div>
                        <div className="detailsView">
                            {this.props.children}
                        </div>
                    </div>
                <div className="otherLink">
                    <ul>
                        <li>
                            <a href="../../agreement/briefIntroduction.html" target="_blank">关于为爱联劝</a>
                        </li>
                        <li>
                            <a>帮助中心</a>
                        </li>
                        <li>
                            <a href="../../agreement/briefIntroduction.html" target="_blank">联系我们</a>
                        </li>
                        <li>
                            <a href="../../agreement/lawAndPrivacy.html" target="_blank">法律声明及隐私权政策</a>
                        </li>
                        <li>
                            <a href="../../agreement/IntellectualPropertyStatement.html" target="_blank">知识产权</a>
                        </li>
                    </ul>
                    <div>备案信息</div>
                </div>
            </div>
        )
    }
    isStatus(){
        let obj = getQueryString();
        if(obj.status==2){
            this.setState({
                isRepair:'submitAudit'
            })
        }
    }
    componentDidMount(){
        this. isStatus();
        window.onload = function(){
            if(window.location.hash=="#/userMessage"||window.location.hash=="#/"||window.location.hash.indexOf("#/userMessage")!=-1){
                $(".firstRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash.indexOf("#/submitAudit")!=-1){
                $(".fourthRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash.indexOf("institutionMessage")!=-1){
                $(".secondRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash.indexOf("contactWay")!=-1){
                $(".thirdRout").addClass("active").find("span").addClass("active3");
            }
        }
        window.onhashchange = function(){
            $("#registerContentList").find(".router").removeClass("active");
            $("#registerContentList").find("span").removeClass("active3");
            if(window.location.hash=="#/userMessage"||window.location.hash=="#/"||window.location.hash=="#userMessage"){
                $(".firstRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash=="#/institutionMessage"){
                $(".secondRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash=="#/contactWay"){
                $(".thirdRout").addClass("active").find("span").addClass("active3");
            }else if(window.location.hash=="#/submitAudit"){
                $(".fourthRout").addClass("active").find("span").addClass("active3");
            }
        }
    }
}

ReactDOM.render((
    <div>
        <Router history={hashHistory}>
            <Route path='/' component={Index}>
                <IndexRoute component={UserMessage}/>
                <Route path="userMessage" component={UserMessage} />
                <Route path="institutionMessage" component={InstitutionMessage} />
                <Route path="contactWay" component={ContactWay} />
                <Route path="submitAudit" component={SubmitAudit} />
            </Route>
        </Router>
    </div>
),document.getElementById("index"))