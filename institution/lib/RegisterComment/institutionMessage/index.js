import React from 'react';
import {uploadImage} from '../../upload';
import {city} from '../../city';
import {isEmail,isVal} from '../../commonEvent';
import update from 'react-addons-update';


export default class InstitutionMessage extends React.Component{
    constructor(){
        super()
        this.state = {
            groupMessage:{},
            orderTime:"orderTime",
            institutionMessage:{
                location:'',
                website:'',
                content:''
            }
        }
    }
    render(){
        return(
            <div className="registerClassify">
                <div className="registerUser" style={{overflow:"inherit"}}>
                    <span className="left startTime">成立时间</span>
                    <input type="text" className="datePicked" ref="startTime" placeholder="格式（2012-12-12）" value={this.state.institutionMessage.startTime} onChange={this.postStartTime.bind(this)}/>
                </div>
                <div className="registerUser" style={{clear:"both"}}>
                    <span className="left accountName">所在地</span>
                    <div className="location left" id="city_1">
                        <select name="" id="province" className="prov" >

                        </select>
                        <select name="" id="city" style={{marginLeft:"2%"}} className="city" >

                        </select>
                        <input type="text" className="detailAddress" placeholder="详细地址" ref="location" value={this.state.institutionMessage.location} onChange={this.postGroupLocation.bind(this)}/>
                    </div>
                </div>
                <div className="registerUser">
                    <span className="left officialWebsite">官方网站</span>
                    <input type="text" className="left officialWebsiteI" placeholder="请输入官方网站(非必须)" ref="website" value={this.state.institutionMessage.website} onChange={this.postGroupWebsite.bind(this)}  />
                </div>
                <div className="registerUser">
                    <span className="left contactPhoneNumber">机构证书</span>
                    <div className="putInstitutionPicture left">
                        <div className="uploadPicture" id="groupMessageImg">
                            <img src={this.state.cover} alt=""/>
                        </div>
                        <div className="uploadImgStatement">
                            <img src="./img/imgStatement.png" alt=""/>
                            (图片大小2M以内，支持jpg/png)
                        </div>
                        <div id="postfiles"></div>
                    </div>
                </div>
                <div className="registerUser">
                    <span className="left institutionIntroduce">机构简介</span>
                    <textarea name=""  className="left institutionIntroduceI" ref="content" placeholder="50字以内简介" value={this.state.institutionMessage.content} onChange={this.postGroupContent.bind(this)}>

                    </textarea>
                </div>
                <div className="save saveUserMessage cursorPointer" onClick={this.nextStep.bind(this)}>
                    下一步
                </div>
            </div>
        )
    }
    componentDidMount(){
        let self = this;
        let groupMessage = JSON.parse(sessionStorage.getItem("groupMessage"));
        let cityList = city().citylist;
        $.each(cityList,function(index,item){
            $("#province").append("<option value='"+index+"'>"+item.p+"</option>")
        })
        if(isVal(groupMessage)!=""){
            this.setState({
                cover:groupMessage.card,
                institutionMessage:{
                    location:groupMessage.location,
                    website:groupMessage.website,
                    content:groupMessage.content
                }
            })
            let orderTime = groupMessage.startTime.substr(0,10).split("-");
            orderTime = orderTime[0]+"-"+Number(orderTime[1])+"-"+Number(orderTime[2])
            $(".datePicked").val(orderTime);
        }
        this.putPicture = uploadImage;
        this.putPicture("groupMessageImg","postfiles",this);
        let i = 0;
        if(isVal(groupMessage)!=""){
            let provinceList = $("#province").find("option");
            $.each(provinceList,function(index,item){
                if($(item).text()==groupMessage.province){
                    i = index;
                    $(item).attr("selected","selected")
                }
            })
        }
        if(sessionStorage.getItem('institutionMessage')&&isVal(groupMessage)==""){
            let institutionMessage = JSON.parse(sessionStorage.getItem('institutionMessage'))
            this.setState({
                institutionMessage:institutionMessage
            },function(){
                $("#city").val(institutionMessage.city);
            })
            let provinceList = $("#province").find("option");
            $.each(provinceList,function(index,item){
                if($(item).text()==institutionMessage.province){
                    i = index;
                    $(item).attr("selected","selected")
                }
            })
            let oldTime = institutionMessage.startTime.substr(0,10).split("-");
            oldTime = oldTime[0]+"-"+Number(oldTime[1])+"-"+Number(oldTime[2])
            $(".datePicked").val(oldTime)
        }
        $.each(cityList[i].c,function(index,item){
            $("#city").append("<option  value='"+item.n+"'>"+item.n+"</option>")
        })
        if(isVal(groupMessage)!=""){
            $("#city").val(groupMessage.city);
        }
        $("#province").on("change",function(event){
            let index = $(this).val()
            $("#city").html("");
            $.each(cityList[index].c,function(index,item){
                $("#city").append("<option value='"+item.n+"'>"+item.n+"</option>")
            })
        })
        document.onkeydown = function(event){
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if(e&&e.keyCode==13){
                self.nextStep()
            }
        }
    }
    nextStep(){
        let institutionMessage = {};
        let startTime = $(this.refs["startTime"]).val();
        institutionMessage.startTime = startTime;
        if(isVal(startTime)==''){
            alert('成立时间不能为空！');
            return;
        }
        let province = $("#province").find("option:selected").text();
        institutionMessage.province = province;
        let city = $("#city").val();
        institutionMessage.city = city;
        let location = $(".detailAddress").val();
        if(isVal(location)==""){
            alert("详细地址不能为空！");
            return false;
        }else if(location.length>50){
            alert("详细地址50字以内！");
            return false;
        }
        institutionMessage.location = location;
        let website = $(".officialWebsiteI").val();
        if(website.length>100){
            alert("官方网站限制100字符以内！");
            return false;
        }
        institutionMessage.website = website;
        let card = this.state.cover;
        if(isVal(card)==""){
            alert("机构证书图片未上传！");
            return false;
        }
        institutionMessage.card = card;
        let content = $(".institutionIntroduceI").val();
        if(isVal(content)==""){
            alert("机构简介不能为空！");
            return false;
        }else if(content.length>50){
            alert("机构简介限制50字以内！");
            return false;
        }
        institutionMessage.content = content;
        sessionStorage.setItem("institutionMessage",JSON.stringify(institutionMessage));
        window.location.href = "#/contactWay";
        //window.location.reload();
    }
    postGroupLocation(){
        let newData = update(this.state.institutionMessage,{'location':{$set:this.refs.location.value}});
        this.setState({
            'institutionMessage':newData
        })
    }
    postGroupContent(){
        let newData = update(this.state.institutionMessage,{'content':{$set:this.refs.content.value}});
        this.setState({
            'institutionMessage':newData
        })
    }
    postGroupWebsite(){
        let newData = update(this.state.institutionMessage,{'website':{$set:this.refs.website.value}});
        this.setState({
            'institutionMessage':newData
        })
    }
    postStartTime(){
        let newData = update(this.state.institutionMessage,{'startTime':{$set:this.refs.startTime.value}});
        this.setState({
            'institutionMessage':newData
        })
    }
}