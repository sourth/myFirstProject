import React from 'react';
import {city} from '../../../../../lib/city'
//import Calendar from '../../../../../lib/calendar/components/Calendar';
import {uploadImage,uploadImageLogo,uploadImageBackground,uploadImageGroupPicture,uploadGroupFiles} from '../../../../../lib/upload';
import {sendAjax,isVal,isEmail,isMobile} from '../../../../../lib/commonEvent';


let token = sessionStorage.getItem("token");
export default class GroupMessageEditor extends React.Component{
    constructor(){
        super();
        this.state = {
            star_level:0,
            message:{},
            groupPageFiles:[
                {
                    name:"",
                    link:"javascript:;"
                }
            ]
        }
    }
    render(){
        return (
            <div className="groupMessage" id="groupMessageEditor">
                <div className="accountTitle">
                    <h2>机构基本信息</h2>
                    <span className="editor" style={{background:"gray"}}>编辑</span>
                </div>
                <div className="institutionMessage">
                    <div className="asset messageItem">
                        <span>机构名称</span>
                        <input type="text" className="name" />
                    </div>
                    <div className="asset messageItem">
                        <span>机构评分</span>
                        <b className="institutionScore">{this.state.star_level}分</b>
                    </div>
                    <div className="asset messageItem">
                        <span>机构常用名</span>
                        <input type="text" className="oftenName" />
                    </div>
                    <div className="asset messageItem" >
                        <span>成立时间</span>
                        <input type="text" placeholder="如 2012-12-12 08:30:00" ref="startTime"/>
                    </div>
                    <div className="asset messageItem locationPlace">
                        <span>所在地</span>
                        <div className="detailPlace">
                            <select name="" id="province"  >

                            </select>
                            <select name="" id="city"  >

                            </select>
                            <input type="text" className="location"  />
                        </div>
                    </div>
                    <div className="asset messageItem">
                        <span>开户姓名</span>
                        <input type="text" className="account" />
                    </div>
                    <div className="asset messageItem">
                        <span>银行卡号</span>
                        <input type="text" className="bankNumber" />
                    </div>
                    <div className="asset messageItem">
                        <span>负责人</span>
                        <input type="tel" className="liable" />
                    </div>
                    <div className="asset messageItem">
                        <span>开户银行</span>
                        <input type="text" className="bankName" />
                    </div>
                    <div className="asset messageItem">
                        <span>联系电话</span>
                        <input type="tel" className="mobile" />
                    </div>
                    <div className="asset messageItem">
                        <span>email</span>
                        <input type="tel" className="email" />
                    </div>
                    {/*<div className="asset messageItem">
                        <span>一句话简介</span>
                        <input type="text" className="website" />
                    </div>*/}
                    <div className="asset messageItem">
                        <span>官方网站</span>
                        <input type="text" className="website" />
                    </div>
                    <div className="messagePicture" style={{clear:"both",margin:"20px 0",overflow:"hidden",marginLeft:"75px"}}>
                        <div className="putInstitutionPicture left">
                            <p >上传机构LOGO</p>
                            <div className="uploadPicture cursorPointer" id="browse1" style={{background:'none'}}>
                                <img src={this.state.message.logo} alt=""/>
                            </div>
                            <div id="postfiles1" className="imgBtn"></div>
                            <p className="groupImgStatement"><img src="./img/imgStatement.png"/>只需上传机构logo图标（尺寸120x120 jpg/png）</p>
                        </div>
                        <div className="putInstitutionPicture left">
                            <p >上传背景图</p>
                            <div className="uploadPicture cursorPointer" id="browse2" style={{background:'none'}}>
                                <img src={this.state.message.background} alt=""/>
                            </div>
                            <div id="postfiles2" className="imgBtn"></div>
                            <p className="groupImgStatement"><img src="./img/imgStatement.png"/>机构背景图（尺寸750x300 jpg/png）</p>
                        </div>
                        <div className="putInstitutionPicture left">
                            <p >上传展示图</p>
                            <div className="uploadPicture cursorPointer" id="browse3" style={{background:'none'}}>
                                <img src={this.state.message.cover} alt=""/>
                            </div>
                            <div id="postfiles3" className="imgBtn"></div>
                            <p className="groupImgStatement"><img src="./img/imgStatement.png"/>机构展示图（尺寸200x160 jpg/png）</p>
                        </div>
                    </div>
                    <div className="asset messageItem groupContent" style={{clear:"both",float:"none"}}>
                        <span>机构简介</span>
						<textarea name="" id=""  className="content" >

						</textarea>
                    </div>
                    <div className="asset messageItem" style={{clear:"both",float:"none",width:"100%"}}>
                        <span style={{width:"10%"}}>机构证件</span>
                        <div className="putInstitutionPicture left">
                            <p >上传机构资格证</p>
                            <div className="uploadPicture cursorPointer" id="browse"  style={{margin:"0"}}           >
                                <img src={this.state.message.card} alt=""/>
                            </div>
                            <div className="uploadImgStatement" style={{marginBottom:'20px'}}>
                                <img src="./img/imgStatement.png" alt=""/>
                                (图片大小2M以内，支持jpg/png)
                            </div>
                            <div id="postfiles" className="imgBtn"></div>
                        </div>
                    </div>
                    <div className="asset messageItem" style={{clear:"both",float:"none"}}>
                        <span>信息公开</span>
                        <div id="isShowGroupFiles">
                            <span className="openFile" onClick={this.isShowFile.bind(this,1)}>公开</span>
                            <span className="hideFile" onClick={this.isShowFile.bind(this,0)}>隐藏</span>
                        </div>
                        <div className="groupFileList left">
                            {
                                this.state.groupPageFiles.map(function(item,index){
                                    return (<p key={index}  style={{display:item.id?"block":"none"}} className="groupOpenMessage">
                                        <a href={item.link} download={item.name}>{item.name}</a>
                                        <span className="cancelFile" style={{margin:'0',display:'block'}} onClick={this.deleteFile.bind(this,item.id)}></span>
                                    </p>)
                                }.bind(this))
                            }
                        </div>
                        <div className="putInstitutionPicture left uploadFiles cursorPointer" style={{width:"70%"}} >
                            <div className="uploadFile underLine" id="browse4"  style={{fontSize:"1.5em",color:"#999",cursor:"pointer"}}           >
                                上传机构文件
                            </div>
                            <div id="postfiles4" className="imgBtn" style={{marginBottom:"0"}}></div>
                        </div>
                    </div>
                </div>
                <div className="saveMessage" onClick={this.saveMessage.bind(this)}>
                    保存
                </div>
            </div>
        )
    }
    deleteFile(id,event,self){
         let e = event || window.event;
        let parent = $(e.target).parents(".groupOpenMessage");
        sendAjax({
            type:"POST",
            url:"admin/self/deleteGroupInfo",
            data:{
                token:token,
                infoId:id
            },
            success:function(data){
                if(data.code==200){
                    alert("删除成功！");
                }
            },
            successThen(data){
                parent.hide();
            }
        })
    }
    isShowFile(type,event,self){
        let e = event || window.event;
        let mySelf = $(e.target)
        sendAjax({
            type:"POST",
            url:"admin/self/editInfoState",
            data:{
                token:token,
                state:type
            },
            success:function(data){
                if(data.code==200){
                    alert("设置成功！");
                    mySelf.css("background","#e6503c").siblings().css("background","#999");
                }
            }
        })
    }
    saveMessage(){
        let self = this;
        //添加机构文件
        if(isVal(this.state.groupFiles)!=""){
            sendAjax({
                type:"POST",
                url:"admin/self/addUploadFile",
                data:{
                    token:token,
                    groupFiles:this.state.groupFiles
                },
                success:function(data){
                   if(data.code!=200){
                       alert(data.message);
                   }
                },
                successThen(data){
                    if(data.code==200){
                        self.changeGroupMessage()
                    }else{
                        alert(data.message);
                    }
                }
            })
        }else{
            this.changeGroupMessage()
        }
    }
    changeGroupMessage(){
        //机构基本信息修改
        let editMessage = {};
        editMessage = this.state.message;
        let name = $(".name").val();
        if(isVal(name)==""){
            alert("机构名称不能为空！");
            return false;
        }else if(name.length>20){
            alert('机构名称限制20字以内！');
            return;
        }
        editMessage.name = name;
        let oftenName = $('.oftenName').val();
        if(oftenName!=''&&oftenName.length>20){
            alert('机构常用名限制20字以内！');
            return;
        }
        editMessage.oftenName = oftenName;
        let start_time = $(this.refs.startTime).val();
        editMessage.startTime = start_time;
        let province = $("#province").find("option:selected").text();
        editMessage.province = province;
        let city = $("#city").val();
        editMessage.city = city;
        let location = $(".location").val();
        editMessage.location = location;
        let account= $(".account").val();
        editMessage.account = account;
        let bankNumber = $(".bankNumber").val();
        editMessage.bankNumber = bankNumber;
        let mobile = $(".mobile").val();
        if(isVal(mobile)==''){
            alert('联系电话不能为空！');
            return;
        }else if(!isMobile(mobile)){
            alert('联系电话格式不正确！');
            return;
        }
        editMessage.mobile = mobile;
        let email = $(".email").val();
        if(isVal(email)==''){
            alert('email不能为空！');
            return;
        }else if(!isEmail(email)){
            alert('email格式不正确！');
            return;
        }
        editMessage.email = email;
        let bank_name = $(".bankName").val();
        editMessage.bankName = bank_name;
        let website = $(".website").val();
        editMessage.website = website;
        let content = $(".content").val();
        if(content.length>50){
            alert("机构简介限制50字以内！");
            return;
        }
        editMessage.content = content;
        let logo = this.state.logo;
        if(isVal(logo)==""&&this.state.message.logo=='./img/groupLogo.png'){
            editMessage.logo = '';
        }
        if(this.state.logo){
            editMessage.logo = logo;
        }
        let background = this.state.backgroundImg;
        if(isVal(background)==""&&this.state.message.background=='./img/groupBackImg.png'){
            editMessage.background = '';
        }
        if(this.state.backgroundImg){
            editMessage.background = background;
        }
        let cover = this.state.showImg;
        if(isVal(cover)==""&&this.state.message.cover=='./img/groupShow.png'){
            editMessage.cover = ''
        }
        if(this.state.showImg){
            editMessage.cover = cover;
        }
        if(this.state.cover){
            editMessage.card = this.state.cover
        }
        let liable = $(".liable").val();
        editMessage.liable = liable;
        editMessage.token = token;
        sendAjax({
            type:"POST",
            url:"admin/self/editInfo",
            data:editMessage,
            success:function(data){
                if(data.code==200){
                    alert("修改信息已提交，需要1-3天审核，请耐心等待！");
                    window.location.reload();
                }else if(data.message=='The start time is not a valid date.'){
                    alert('机构成立时间格式不正确');
                }else{
                    alert(data.message);
                }
            }
        })
    }
    componentDidMount(){
        let self = this;
        this.putPicture = uploadImage;
        this.putPicture("browse","postfiles",this);
        uploadImageLogo(this);
        uploadImageGroupPicture(this);
        uploadImageBackground(this);
        uploadGroupFiles(this,1);
        $(".datePicked").css({
            "fontSize":"1.5em",
            float:"none",
            width:"100%"
        });
        let cityList = city().citylist
        $.each(cityList,function(index,item){
            $("#province").append("<option value='"+index+"'>"+item.p+"</option>")
        })
        $.each(cityList[0].c,function(index,item){
            $("#city").append("<option value='"+item.n+"'>"+item.n+"</option>")
        })
        $("#province").on("change",function(event){
            let index = $(this).val()
            $("#city").html("");
            $.each(cityList[index].c,function(index,item){
                $("#city").append("<option value='"+item.n+"'>"+item.n+"</option>")
            })
        })
        this.getGroupMessage()
    }
    getGroupMessage(){
        let self = this;
        let cityList = city().citylist
        if(isVal(token)!=""){
            sendAjax({
                type:"POST",
                url:"admin/self/findInfo",
                data:{
                    token:token
                },
                success:function(data){
                    if(data.code==200){
                        let message= data.message;
                        if(message.cover==""){
                            message.cover='./img/groupShow.png';
                        }
                        if(message.logo==""){
                            message.logo='./img/groupLogo.png';
                        }
                        if(message.background==""){
                            message.background='./img/groupBackImg.png';
                        }
                        if(message.info==0){
                            $('.hideFile').css("background","#e6503c").siblings().css("background","#999");
                        }
                        self.setState({
                            star_level:message.star_level/2,
                            message:message,
                        })
                        $(".name").val(message.name);
                        //let orderTime = message.start_time.substr(0,10).split("-");
                        //orderTime = orderTime[0]+"-"+Number(orderTime[1])+"-"+Number(orderTime[2])
                        //$(".datePicked").text(orderTime)
                        $(self.refs.startTime).val(message.start_time);
                        let provinceList = $("#province").find("option");
                        let i = 0;
                        $.each(provinceList,function(index,item){
                            if($(item).text()==message.province){
                                i = index;
                                $(item).attr("selected","selected")
                            }
                        })
                        //$("#province").find("option").eq(message.province).attr("selected","selected");
                        $(".liable").val(message.liable);
                        $(".email").val(message.email)
                        $(".location").val(message.location);
                        $(".account").val(message.account);
                        $(".username").val(message.liable);
                        $(".mobile").val(message.mobile);
                        //$(".email").val(message.email);
                        $(".bankName").val(message.bank_name);
                        $(".website").val(message.website);
                        $(".content").val(message.content);
                        $(".bankNumber").val(message.bank_number);
                        $('.oftenName').val(message.often_name);
                        $("#city").html("");
                        if(data.message.userinfo){
                            self.setState({
                                groupPageFiles:data.message.userinfo
                            })
                        }
                        $.each(cityList[i].c,function(index,item){
                            $("#city").append("<option value='"+item.n+"'>"+item.n+"</option>")
                        })
                        $("#city").val(message.city);
                    }else{
                        alert(data.message)
                    }
                }
            })
        }
    }
    componentWillUnMount(){
       token = null;
    }
}
