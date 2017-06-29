
//ajax 异步交互
export function sendAjax(obj) {
    let  baseUrl = "http://api.fojiaosiyuan.com/";
    //let baseUrl = 'http://walqapi.lingshanfoundation.org/';


    let  url = baseUrl+obj.url;
    let  data = obj.data;
    let  async = obj.async;
    let  loadFlag = obj.loadFlag==undefined?false:obj.loadFlag;
    let  type = obj.type;
    let  cache = obj.cache;
    let  successThen = function(){};
    if(obj.successThen){
        successThen = obj.successThen;
    }
    let beforefn = obj.beforeSend;
    let completefn = obj.complete;
    let  successfn = obj.success;
    async = (async==null || async==="" || typeof(async)=="undefined")? "true" : async;
    cache = (cache==null || cache==="" || typeof(cache)=="undefined")? "false" : cache;
    type = (type==null || type==="" || typeof(type)=="undefined")? "GET" : type.toLocaleUpperCase();
    data = (data==null || data==="" || typeof(data)=="undefined")? {"date": new Date().getTime()} : data;
    //POST,PUT 转化成json字符串
    if(type=="POST" || type=="PUT"){

    }
    $.ajax({
        type: type,
        async: async,
        data: data,
        url: url,
        cache: cache,
        //contentType : "application/x-www-form-urlencoded",
        dataType: 'json',
        timeout:30000,
         beforeSend: function(XMLHttpRequest){
             if(beforefn){
                 beforefn()
             }
         },
        success: function(json){
            successfn(json);
        },
        error: function(XMLHttpRequest, status, error) {

            if (XMLHttpRequest.status == 401) {


            }

        },
        complete :function(XMLHttpRequest, TS){
            if(completefn){
                completefn()
            }
        }
    }).then(function(data){
        successThen(data)
    });
}
// 页面传参 获取
export function getQueryString() {
    let  url = location.href; //获取url中"?"符后的字串
    url = decodeURI(url);
    let  theRequest = new Object();
    if (url.indexOf("?") != -1) {
        url = url.substring(url.indexOf("?")+1);
        let  str = url;
        str = str.split("&");
        for(let  i = 0; i < str.length; i ++) {
            theRequest[str[i].split("=")[0]]=unescape(str[i].split("=")[1]);
        }
    }
    return theRequest;
}
let reg = '';
//空字符验证
export function isVal (val){
    if(val == null || val == undefined || val == "" || val==NaN){
        return "";
    }else{
        if((typeof str)=='string'){
            val = val.replace(/(^\s+)|(\s+$)/g,"");
        }
        return val;
    }
};
//邮箱验证
export function isEmail (val) {
    let str = val.trim();
    if(str.length!=0){
        reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//移动电话固话验证，已做限制
export function isMobile(val) {
    let str = val.trim();
    if(str.length!=0){
        reg= /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        let reg1 = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        if(reg.test(str) || reg1.test(str)){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
//纯移动手机验证
export function isOnlyMobile(val) {
    let str = val.trim();
    if(str.length!=0){
        reg= /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
        if(reg.test(str)){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
}
//移动手机验证未做限制，只要是11位数字即可
export function isMobileB(val) {
    let str = val.trim();
    if(str.length!=0){
        reg= /^[0-9]{11}$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//密码验证 由6-13位数字和字母组成
export function isPassword(val){
    let str = val.trim();
    if(str.length!=0){
        reg= /^[a-zA-Z0-9]{6,16}$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//
export function isUserName(val){
    let str = val.trim();
    if(str.length!=0){
        reg= /^[a-zA-Z0-9]{5,15}$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//身份证验证
export function isCardNo(val) {
    let str = val.trim();
    if(str.length!=0){
        reg= /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//中文验证
export function isChWord(val){
    let str = val.trim();
    if(str.length!=0){
        reg= /^[\u4e00-\u9fa5]+$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//英文加空格验证
export function isEnWord(val){
    let str = val.trim();
    if(str.length!=0){
        reg= /^[A-Za-z\s]+$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//订单号 基础验证1-50位数字和英文混合
export function isOrderNumber(val){
    let str = val.trim();
    if(str.length!=0){
        reg= /^[a-zA-Z0-9]{1,50}$/;
        if(!reg.test(str)){
            return false;
        }else{
            return true;
        }
    }else{
        return false;
    }
}
//分页
export function getPageArray(currentPage,totalNum,pageSize){
    let totalPage = totalNum;
    //if(totalNum%10==0){
    //    totalPage = parseInt(totalNum/pageSize);
    //}else{
    //    totalPage = (parseInt(totalNum/pageSize)+1);
    //}


    let array = new Array();

    let length = 6;
    let first = 1;
    let slider = 1;
    let begin = currentPage-parseInt(length/2);
    if (begin < 1) {
        begin = 1;
    }
    let end = begin + length - 1;
    let last = totalPage;
    if (end >= last) {
        end = last;
        begin = end - length + 1;
        if (begin < first) {
            begin = first;
        }
    }
    if (begin > first) {
        let i = 0;
        for (i = first; i < first + slider && i < begin; i++) {
            array.push({"pageNo":i,"pageName":i});
        }
        if (i < begin) {
            array.push({"pageNo":-1,"pageName":"..."});
        }
    }

    for (let i = begin; i <= end; i++) {
        array.push({"pageNo":i,"pageName":i});
    }

    if (last - end > slider) {
        array.push({"pageNo":-1,"pageName":"..."});
        end = last - slider;
    }

    for (let i = end + 1; i <= last; i++) {
        array.push({"pageNo":i,"pageName":i});
    }

    return array;
}

//功能介绍：检查是否为日期时间
export function CheckDateTime(str){
    let reg = /^(\d+)-(\d{1,2})-(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
    let r = str.match(reg);
    if(r==null)return false;
    r[2]=r[2]-1;
    let d= new Date(r[1], r[2],r[3], r[4],r[5], r[6]);
    if(d.getFullYear()!=r[1])return false;
    if(d.getMonth()!=r[2])return false;
    if(d.getDate()!=r[3])return false;
    //if(d.getHours()!=r[4])return false
    //if(d.getMinutes()!=r[5])return false;
    //if(d.getSeconds()!=r[6])return false;
    return true;
}