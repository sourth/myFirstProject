import {sendAjax} from './commonEvent';
export function uploadImage(id1,id2,that,type,id3,activityId){
    let enrollId = ''
    if(activityId){
        enrollId = activityId;
    }
    let progressImg = [];
    let documentType = { title : "Image files", extensions : "jpg,png" };
    let isMulti = false;
    let token = sessionStorage.getItem("token");
    let serverUrlForGroup = ' http://walqapi.lingshanfoundation.org/admin/aliyunoss/policy?token='+token+'&dir=donateForLove';
    if(id1=='groupMessageImg'){
        serverUrlForGroup = 'http://walqapi.lingshanfoundation.org/adminLogin/policy?dir=donateForLove';
    }
    if(type==""||type==null||type=="undefined"){
        documentType ={ title : "Image files", extensions : "jpg,png" };
    }else if(type==1){
        isMulti = true;
        documentType = { title : "Word files", extensions : "excel,doc,pdf,docx,xls,xlsx" };
    }else if(type==2){
        isMulti = true;
        documentType = { title : "Image files", extensions : "jpg,png" };
    }else if(type==3){
        documentType = { title : "Word files", extensions : "xls,xlsx" };
    }
    let accessid = ''
    let accesskey = ''
    let host = ''
    let policyBase64 = ''
    let signature = ''
    let callbackbody = ''
    let filename = ''
    let key = ''
    let expire = 0
    let g_object_name = ''
    let timestamp
    let now = timestamp = Date.parse(new Date()) / 1000;
    let groupFiles = [];
    function send_request()
    {
        let xmlhttp = null;
        if (window.XMLHttpRequest)
        {
            xmlhttp=new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (xmlhttp!=null)
        {
            let serverUrl = 'http://api.fojiaosiyuan.com/admin/aliyunoss/policy?token=eyJpdiI6IlhpTmlKUk5hbG9xSTZcL1wvTldUYzhMdz09IiwidmFsdWUiOiJDZWlCMkxaUlZqRTNXWjlDdzVFUG9ncnVwOWxjU0FHNzIrVU93c1VnWDVPTDZCRTIwWHBnWHI5ZWVWOVk5ejRUcHR6SXhwTEd6d0xDdDdxZkFicSsyUT09IiwibWFjIjoiYmY0Yjg2ZTUxYWI2OWI2ZjkyNDg4Y2U1MjhmNWU2ODk2ZjhhOTgzZDdkZGY0YWUzYzg3ODc4YmY3OWJlYzYzNiJ9&dir=donateForLove'
            //let serverUrl = serverUrlForGroup;
            xmlhttp.open( "GET", serverUrl, false );
            xmlhttp.send( null );
            return xmlhttp.responseText
        }
        else
        {
            alert("Your browser does not support XMLHTTP.");
        }
    };

    function get_signature()
    {
        //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
        now = timestamp = Date.parse(new Date()) / 1000;
        if (expire < now + 3)
        {
            let body = send_request()
            let obj = eval ("(" + body + ")");
            host = obj['signature']['host']
            policyBase64 = obj['signature']['policy']
            accessid = obj['signature']['accessid']
            signature = obj['signature']['signature']
            expire = parseInt(obj['signature']['expire'])
            callbackbody = obj['signature']['callback']
            key = obj['signature']['dir']
            return true;
        }
        return false;
    };

    function random_string(len) {
        len = len || 32;
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        let maxPos = chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function get_suffix(filename) {
        let pos = filename.lastIndexOf('.')
        let suffix = ''
        if (pos != -1) {
            suffix = filename.substring(pos)
        }
        return suffix;
    }

    function calculate_object_name(filename){
        let suffix = get_suffix(filename)
        g_object_name = key + random_string(10) + suffix;
    }

    function set_upload_param(up, filename, ret)
    {
        if (ret == false)
        {
            ret = get_signature()
        }
        g_object_name = key;
        if (filename != '') {
            let suffix = get_suffix(filename)
            calculate_object_name(filename)
        }
        let new_multipart_params = {
            'key' : g_object_name,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'callback' : callbackbody,
            'signature': signature,
        };
        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });

        up.start();
    }

    function previewImage(file,callback){
        if(!file || !/image\//.test(file.type)) return;
        if(file.type=='image/gif'){
            let fr = new mOxie.FileReader();
            fr.onload = function(){
                callback(fr.result);
                fr.destroy();
                fr = null;
            }
            fr.readAsDataURL(file.getSource());
        }else{
            let preloader = new mOxie.Image();
            preloader.onload = function() {
                preloader.downsize( 300, 300 );
                let imgsrc = preloader.type=='image/jpeg' ? preloader.getAsDataURL('image/jpeg',80) : preloader.getAsDataURL();
                callback && callback(imgsrc); //callback传入的参数为预览图片的url
                preloader.destroy();
                preloader = null;
            };
            preloader.load( file.getSource() );
        }
    }

    let uploader = new plupload.Uploader({
        browse_button :id1,
        multi_selection: isMulti,
        //container: document.getElementById('container'),
        flash_swf_url : 'Moxie.swf',
        silverlight_xap_url : 'Moxie.xap',
        url : 'http://oss.aliyuncs.com',

        filters: {
            mime_types : [
                documentType
            ],
            max_file_size : '2mb', //最大只能上传10mb的文件
            prevent_duplicates : false
        },

        init: {
            PostInit: function() {
                //document.getElementById(id2).onclick = function() {
                //return false;
                //};
            },

            FilesAdded: function(up, file) {
                plupload.each(file, function(file) {
                    if(id1=="browse4"){
                        document.getElementById(id2).innerHTML += '<div id="' + file.id + '">'+file.name+'<b></b>'
                            +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div><span style="display:block;text-align:center;" class="' + file.id + '"></span>'
                            +'</div>';
                    }else if(id1=='addProgressImg'){
                        if(progressImg.length>9){
                            alert("最多上传9张图片！");
                            return;
                        }
                        document.getElementById(id2).innerHTML += '<div class="progressImg" id="' + file.id + '"><img  /><b></b>'
                            +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div><span style="display:block;text-align:center;" class="' + file.id + '"></span>'
                            +'</div>';
                    }else{
                        document.getElementById(id2).innerHTML = '<div id="' + file.id + '"><b></b>'
                            +'<div class="progress"><div class="progress-bar" style="width: 0%"></div></div><span style="display:block;text-align:center;" class="' + file.id + '"></span>'
                            +'</div>';
                    }
                });
                if(id1!="addProgressImg"){
                    if(file[0]['type'] == 'image/gif'){
                        let fr = new mOxie.FileReader();
                        fr.onload = function(){
                            file[0].imgsrc = fr.result;
                            fr.destroy();
                            fr = null;
                        }
                        fr.readAsDataURL(file[0].getSource());
                    }else{
                        let target = id1;
                        if(id3){
                            target = id3
                        }
                        let preloader = new mOxie.Image();
                        preloader.onload = function(){
                            let browse = document.getElementById(target);
                            let imgsrc = preloader.type == 'image/jpeg' ? preloader.getAsDataURL('image/jpeg', 80):preloader.getAsDataURL();
                            file[0].imgsrc = imgsrc;
                            let image = document.createElement('img');
                            image.src = file[0].imgsrc;
                            browse.innerHTML = '';
                            browse.appendChild(image);
                            preloader.destroy();
                            preloader = null;
                        };
                        preloader.load(file[0].getSource());
                    }
                }
                set_upload_param(uploader,'', false);
                $('.moxie-shim-html5').css('display','none');
            },
            UploadProgress: function(up, file) {
                var d = document.getElementById(file.id);
                var prog = d.getElementsByTagName('div')[0];
                var progBar = prog.getElementsByTagName('div')[0]
                progBar.style.width= 2*file.percent+'px';
                progBar.setAttribute('aria-valuenow', file.percent);
                var s = document.getElementsByClassName(file.id)[0];
                s.innerText = "上传中";
            },

            BeforeUpload: function(up, file) {
                set_upload_param(up, file.name, true);
            },

            FileUploaded: function(up, file, info) {
                if (info.status == 200){
                    var cover = host + '/' + g_object_name;
                    if(id1=="browse" || id1=='activityAddBannerImg' || id1=='groupMessageImg' || id1=='projectAddBannerImg' || id1=='projectCompileImg'){
                        that.setState({
                            'cover':cover
                        })
                    }else if(id1=="browse1"){
                        that.setState({
                            'logo':cover
                        })
                    }else if(id1=="browse2"){
                        that.setState({
                            'backgroundImg':cover
                        })
                    }else if(id1=="browse3"){
                        that.setState({
                            'showImg':cover
                        })
                    }else if(id1=="browse4"){
                        let files = {};
                        let index = file.name.lastIndexOf('.')
                        files.name = file.name.substr(0,index);
                        files.link = cover;
                        groupFiles.push(files);
                        that.setState({
                            groupFiles:groupFiles
                        })
                    }else if(id1=='addProgressImg'){
                        if(sessionStorage.getItem("isEmptyProgressImg")=="yes"){
                            progressImg = [];
                            sessionStorage.removeItem("isEmptyProgressImg");
                        }
                        progressImg.push(cover);
                        var d = document.getElementById(file.id);
                        var img = $(d).find("img")[0];
                        img.src = cover;
                        that.setState({
                            progressImg:progressImg
                        })
                    }else if(id1=='activityCompileImg'){
                        that.setState({
                            'banner':cover
                        })
                    }else if(id1=='projectBookBudget'){
                        that.setState({
                            projectBookBudget:cover
                        })
                    }else if(id1=='activityAddShowImg'){
                        that.setState({
                            activityAddShowImg:cover
                        })
                    }else if(id1=='activityAddPosterImg' ){
                        that.setState({
                            activityPosterImg:cover
                        })
                    }else if(id1=='activityCompilePosterImg'){
                        that.setState({
                            activityCompilePosterImg:cover
                        })
                    }else if(id1=='activityCompileShowImg'){
                        that.setState({
                            activityCompileShowImg:cover
                        })
                    }else if(id1=='projectAddShowImg'){
                        that.setState({
                            projectAddShowImg:cover
                        })
                    }else if(id1=='projectCompileShowImg'){
                        that.setState({
                            projectCompileShowImg:cover
                        })
                    }else if(id1=='uploadReceiptFunds'){
                        that.setState({
                            uploadReceiptFunds:cover
                        },function(){
                            alert('上传成功');
                        })
                    }else if(id1=='uploadInvoice'){
                        that.setState({
                            uploadInvoice:cover
                        },function(){
                            alert('上传成功');
                        })
                    }else if(id1=='uploadReceiptFunds1'){
                        that.setState({
                            uploadReceiptFunds1:cover
                        },function(){
                            alert('上传成功');
                        })
                    }else if(id1=='uploadInvoice1'){
                        that.setState({
                            uploadInvoice1:cover
                        },function(){
                            alert('上传成功');
                        })
                    }else if(id1=='putInEnroll'){
                        let enrollTable = cover;
                        putInEnroll(enrollId,enrollTable,that)
                    }
                    var s = document.getElementsByClassName(file.id)[0];
                    s.innerText = "上传成功";

                }else{
                    alert('提交失败')
                }
            },

            Error: function(up, err) {
                if (err.code == -600) {
                    alert('文件太大啦!')
                }
                else if (err.code == -601) {
                    if(id1=='putInEnroll'){
                        alert('文件不是Excel文件')
                    }else{
                        alert('文件不是图片!')
                    }
                }
                else if (err.code == -602) {
                    alert('该文件已上传!')
                }
                else
                {
                    alert("\nError xml:" + err.response);
                }
            }
        }
    });

    uploader.init();

}

export function uploadImageLogo (that){
    uploadImage("browse1","postfiles1",that)
}
export function uploadImageBackground (that){
    uploadImage("browse2","postfiles2",that)
}
export function uploadImageGroupPicture (that){
    uploadImage("browse3","postfiles3",that)
}
export function uploadGroupFiles(that,type){
    uploadImage("browse4","postfiles4",that,type)
}
export function putInEnroll(enrollId,enrollTable,that){
    let token = sessionStorage.getItem('token');
    sendAjax({
        type:'POST',
        url:'admin/activity/addActivityExcel',
        data:{
            token:token,
            activityId:enrollId,
            link:enrollTable
        },
        success:function(data){
            if(data.code==200){
                alert('导入成功！');
                window.location.reload();
                //that.props.updateOffLineEnrollList(true)
            }else{
                alert(data.message)
            }
        }
    })
}