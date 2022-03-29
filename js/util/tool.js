//工具类

var preTimestamp = 0;

//限制操作频率的函数。
function debounceDo(action,intervalTime,app) {
    if (new Date().getTime() - preTimestamp > intervalTime){
        action(app);
    }
    else{
        console.log("还需要"+(new Date().getTime() - preTimestamp)+"毫秒才能点击");
    }
    preTimestamp = new Date().getTime();
}

//重新字符串的endWith方法，以指定的字符结尾会返回true
String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)===d);
}

//获取当前的日期时间 格式“yyyy-MM-dd hh:mm:ss”  2018-07-23 14:47:35
function getNowFormatDate() {
    return new Date().Format("yyyy-MM-dd hh:mm:ss");
}

/*function getFormatDate(timestamp,) {
    return new Date(timestamp).Format("yyyy/MM/dd");
}*/

function getFormatDate(timestamp,format) {
    if (!$.isEmptyObject(format)){
        return new Date(timestamp).Format(format);
    }
    return new Date(timestamp).Format("yyyy/MM/dd");
}


//返回当前时间戳
function getCurrentTimeMillis() {
    return new Date().getTime();
}

//获取URL参数值
function getQueryURLString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
}

//获取URL参数值（兼容中文）
function getURLValue(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]); return null;
}




/*格式化日期，调用
    var time1 = new Date().Format("yyyy-MM-dd");
    var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");
*/
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

var DATA_HOBBYS = [
    {key: "1", value: "喜欢游戏"},
    {key: "2", value: "喜欢旅行"},
    {key: "3", value: "喜欢看书"},
    {key: "4", value: "喜欢运动"},
    {key: "5", value: "喜欢追星"},
    {key: "6", value: "喜欢美食"},
    {key: "7", value: "喜欢音乐"},
    {key: "8", value: "喜欢学习"},
    {key: "9", value: "喜欢探险"}
];



function getValueFromMapKey(data,key) {
    for (var i=0;i<data.length;i++){
        //console.log(key+"===:"+DATA_HOBBYS[i].key+"  "+DATA_HOBBYS[i].value);
        if (data[i].key===key){
            return data[i].value;
        }
    }
}

function isPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}

//生成UUID
function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}


function adapterH5Client() {
    if (!isPC()){
        $(".indexItem").css("width","20%");
        $(".indexItem1").css("width","20%");
        $(".indexItem_margin").css("margin-left","0px");
        $(".head-left").css("display","none");
        $(".and-link").css("display","block");
        $(".pc_screenn").css("display","none");
        $(".top-logo").css("width","100%");

    }
    else {
        $(".indexItem").css("width","10%");
        $(".indexItem1").css("width","10%");
        $(".indexItem_margin").css("margin-left","20%");
        $(".head-left").css("display","block");
        $(".and-link").css("display","none");
        $(".pc_screenn").css("display","block");
        $(".top-logo").css("width","30%");
    }

}

//复制内容到剪贴板
function copyToClipboard(text) {
    /*if(text.indexOf('-') !== -1) {
        var arr = text.split('-');
        text = arr[0] + arr[1];
    }
    var textArea = document.createElement("textarea");
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    textArea.style.padding = '0';
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    textArea.style.background = 'transparent';
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? '已复制' : '该浏览器不支持点击复制到剪贴板';
        //alert(msg);
        Bridge.toast(msg);
    } catch (err) {
        alert('该浏览器不支持点击复制到剪贴板');
    }

    document.body.removeChild(textArea);*/

    if(typeof document.execCommand!=="function"){
        alert("复制失败，请长按复制");
        return;
    }
    var dom = document.createElement("textarea");
    dom.value = text;
    dom.setAttribute('style', 'display: block;width: 1px;height: 1px;');
    document.body.appendChild(dom);
    dom.select();
    var result = document.execCommand('copy');
    document.body.removeChild(dom);
    if (result) {
        alert("复制成功");
        return;
    }
    if(typeof document.createRange!=="function"){
        alert("复制失败，请长按复制");
        return;
    }
    var range = document.createRange();
    var div=document.createElement('div');
    div.innerHTML=text;
    div.setAttribute('style', 'height: 1px;fontSize: 1px;overflow: hidden;');
    document.body.appendChild(div);
    range.selectNode(div);
    const selection = window.getSelection();
    if (selection.rangeCount > 0){
        selection.removeAllRanges();
    }
    selection.addRange(range);
    document.execCommand('copy');
    alert("复制成功")
}

//判断是否微信浏览器
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
}

//从当前URL里面删除某个参数
function delUrlParam(name){
    var loca = window.location;
    var baseUrl = loca.origin + loca.pathname + "?";
    var query = loca.search.substr(1);
    if (query.indexOf(name)>-1) {
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return url
    }else{
        return window.location.href;
    };
}

//对特定的url里面删除某个参数
function urlDelP(url,name){
    var urlArr = url.split('?');
    if(urlArr.length>1 && urlArr[1].indexOf(name)>-1){
        var query = urlArr[1];
        var obj = {}
        var arr = query.split("&");
        for (var i = 0; i < arr.length; i++) {
            arr[i] = arr[i].split("=");
            obj[arr[i][0]] = arr[i][1];
        };
        delete obj[name];
        var urlte = urlArr[0] +'?'+ JSON.stringify(obj).replace(/[\"\{\}]/g,"").replace(/\:/g,"=").replace(/\,/g,"&");
        return urlte;
    }else{
        return url;
    }
}

function isEmpty(text) {
    return text === undefined || text === "" || text === null || text === "null" || text === NaN;
}

//数字是否是整数
function isNormalInteger(str) {
    var n = Math.floor(Number(str));
    return n !== Infinity && String(n) === str && n >= 0;
}


function getActivityRemainTime(endTimestamp,defaultDesc) {
    var remainTimeSecend = endTimestamp-new Date().getTime();
    if (remainTimeSecend > 0) {
        var days = parseInt(remainTimeSecend / (1000 * 60 * 60 * 24));
        var hours = parseInt((remainTimeSecend - days * (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = parseInt((remainTimeSecend - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60)) / (1000 * 60));
        var seconds = parseInt((remainTimeSecend - days * (1000 * 60 * 60 * 24) - hours * (1000 * 60 * 60) - minutes * (1000 * 60)) / (1000));

        var resultString = (days > 0?(days+"天"):"") +
            (hours>=10?hours+":":"0"+hours +":")+
            (minutes>=10?minutes+":":"0"+minutes +":")+
            (seconds>=10?seconds+"":"0"+seconds);
        return  resultString;
    }
    else if (defaultDesc) {
        return defaultDesc;
    }
    else{
        return "已到期（具体以审核结果为准）";
    }
}


function getVisitFormatDateTime(timestamp){
    if (timestamp>0){
        var time = parseInt((new Date().getTime() - timestamp)/1000);
        var sb ="";
        if (time > 0 && time < 60) { // 1小时内
            return sb+= time + "秒前";
        } else if (time > 60 && time < 3600) {
            return sb+=parseInt(time / 60)+"分钟前";
        } else if (time >= 3600 && time < 3600 * 24) {
            return sb+=parseInt(time / 3600) +"小时前";
        }else if (time >= 3600 * 24 && time < 3600 * 24*2) {
            return sb+="昨天";
        }else if (time >= 3600 * 24*2 && time < 3600 * 24*3) {
            return sb+="前天";
        }else if (time >= 3600*24*3 && time < 3600*24*30) {
            return sb+=parseInt(time/(3600*24)) +"天前";
        }else if (time >= 3600*24*30 && time < 3600*24*30*12) {
            return sb+=parseInt((time/(3600*24*30))) +"月前";
        }else if (time >= 3600*24*30*12) {
            return sb+=parseInt(time/(3600*24*30*12)) +"年前";
        }
    }
    return "";
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix){
        return this.slice(0, prefix.length) === prefix;
    };
}
