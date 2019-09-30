
//##SET##请求服务端域名配置
const AJAXDOMAINNAME=window.location.href.indexOf('localhost') > -1 ? '' : 'https://cic.facebank.cn';
//const AJAXDOMAINNAME='https://cic.facebank.cn';
//##SET##跳转域名配置 1.测试域名'm' 2.预上线域名'mst'
//const DOMAINNAME='https://m.facebank.cn';
const DOMAINNAME='https://m.facebank.cn';

//##SET##  url配置 1.测试域名'test' 2.预上线域名'st'
//const URLSET='test';
 const URLSET=defaultConfig.isTest ? 'test' : '';
 const IsPC = defaultConfig.IsPC;
//##SET##  url配置 1.上线+测试 '' 2.预上线 'st'
//const CMSSET='';
const CMSSET='';

//##SET##
const DAYSET='365';
function randomString(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
        a = t.length,
        n = "";
    for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
}
function executePrompt(strs){
    var str = strs;
    var arr1 = str.split("");// 在每个逗号(,)处进行分解。
    var confusion_str = randomString(str.length);
    var arr2 = confusion_str.split("");
    var result = "";
    for (var i = 0; i < str.length; i++) {
        result += arr1[i]+arr2[i];
    }
    result += "%" + randomString(str.length*3);
    return result;
}
function checkPassword(str){
    var reg = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%&]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%&]+$)(?![\d!@#$%&]+$)[a-zA-Z\d!@#$%&]+$/;
    return reg.test(str);
}
/*
 *获取用户基本信息
 */
function getUserInfo(){
    var logined = '',userId='',hasInvest='',userInfo = {}, error, isIdValify, xhrData = {};
    $.ajax({
        url : AJAXDOMAINNAME+ '/wap/getUserBaseInfo',
        async : false,
        error: function(XMLHttpRequest, textStatus) {
            if(textStatus == 'error'){
                toastFuc('网络请求错误，请稍候重试');
            }else if(textStatus == 'timeout'){
                toastFuc('网络请求超时，请稍候重试');
            }
            xhrData = {
                success : false,
                message : (textStatus == 'error' ? '网络请求错误，请稍候重试' : textStatus == 'timeout' ? '网络请求超时，请稍候重试' : '')
            }
        },
        success: function(res) {
            if (res.code == 1) {
                isIdValify = !(res.data.hasIdValify == '0');//0:未实名认证 ; 1:已实名认证
                hasInvest=res.data.hasInvest;
                logined = true;
                userInfo = res.data;
                userId=res.data.userId;
                xhrData = {
                    success : true,
                    message : '成功!'
                }
            }else{
                logined = false;
                xhrData = {
                    success : false,
                    message : res.message
                }
            }
        }
    })
    return {
        isIdValify : isIdValify,
        encryptUserId:userId,
        isHasInvest:hasInvest,
        info : userInfo,
        isLogin : logined,
        isBindCard : (userInfo.userBindCardState*1 == 1 ? true : false),
        xhrData : xhrData
    };
}
/*
 *获取加密的userId
 */
 function getSecretKey(){
     var userId='';
     $.ajax({
         url : AJAXDOMAINNAME+ '/wap/getSecretKey',
         async : false,
         success: function(res) {
             if (res.code == 1) {
                  userId=res.data.userId;
             }
         }
     });
     return userId;
 }
/*
 * 获取url传参
 */
function getParames(){
    var url = window.location.href,
        parames = url.split('?')[1];
    if(parames){
        var parame = parames.split('&'),
            returnParame = {};
        for(var i = 0 ; i <= parame.length-1 ; i++){
            var singer = parame[i].split('=');
            returnParame[singer[0]] = singer[1]
        };
        return returnParame;
    }else{
        return {};
    }
}
/*
 * 浏览器判断
 */
function borwer(){
    var u = navigator.userAgent;
	return {
		trident: u.indexOf('Trident') > -1,
		presto: u.indexOf('Presto') > -1,
		webKit: u.indexOf('AppleWebKit') > -1,
		gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
		mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
		ios: (!!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/)),
		android: (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1),
		iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
        iPad: u.indexOf('iPad') > -1,
        weixin: u.indexOf('MicroMessenger') > -1,
		webApp: u.indexOf('Safari') == -1
	};
}


/*
 * 账户状态  100未开户 150未激活需要4要素激活 160未激活需要2要素激活 200正常   300账户冻结 350用户冻结 400销户
 * 2要素还是4要素
 */
function activeType(callBack){
    var userInfo = getUserInfo();
    if(userInfo.info.accountState*1 == 150){//四要素
        callBack('isFour')
    }else if(userInfo.info.accountState*1 == 160 || userInfo.info.accountState*1 == 100){
       //二要素 160账户更换过手机号或者解绑过银行卡等   100未开户
        callBack('isTwo')
    }
}

/**
 * 去掉toFixed后末尾的0
 */
function toFixed(number = 0, digits = 2){
  return Number(number).toFixed(digits);
}

/**
 * 金额格式化显示，三位一个逗号
 */
function currency(number = 0, digits = 2){
  return Number(number).toFixed(digits).replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,');
}

/**
    金额千分位处理
**/
function formatThousandth(val){
    var money = val.toString().split('.')
    var lastMoney = money[0].replace(/(\d{1,3})(?=(\d{3})+$)/g,'$1,');
    if(money[1]){
        var decimal = '.' + (money[1].length > 1 ? (money[1][0]+money[1][1]) : (money[1] + '0'));
        lastMoney = lastMoney + decimal;
    }
    return lastMoney;
}
/**
    金额千分位保留两位小数
**/
function formatThousandthFixed(numStr){
    return numStr.replace(/,/g, '').replace(/[^0-9.]/, '').replace(/([0-9]+.[0-9]{2})[0-9]*/, "$1");;
}
/**
 * 日期格式化年月日
 */
function dateDayFormata(shijianchuo){
   //shijianchuo是整数，否则要parseInt转换
   var time = new Date(shijianchuo);
   var y = time.getFullYear();
   var m = time.getMonth()+1;
   var d = time.getDate();

   return y+'-'+add(m)+'-'+add(d);
}

/**
 * 日期格式化年月日时分秒
 */
function dateSecondFormata(shijianchuo){
   //shijianchuo是整数，否则要parseInt转换
   var time = new Date(shijianchuo);
   var y = time.getFullYear();
   var m = time.getMonth()+1;
   var d = time.getDate();
   var h = time.getHours();
   var mm = time.getMinutes();
   var s = time.getSeconds();
   return y+'-'+add0(m)+'-'+add0(d)+' '+add0(h)+':'+add0(mm);
}
function add(m){return m<10?'0'+m:m }

/**
 * 微信环境
 */
function isWeiXin(){
    var ua = window.navigator.userAgent.toLowerCase();
    if(ua.match(/MicroMessenger/i) == 'micromessenger'){
        return true;
    }else{
        return false;
    }
}

// 设置标题
function setDocumentTitle(title) {
  document.title = title;
  // iOS中特殊处理
  // 微信使用WKWebView，在单页应用中通过document.title多次修改原生title的方法将失效，该问题将于微信3月份发布的版本中解决。
  let ua = navigator.userAgent;
  if (/ip(hone|od|ad)/i.test(ua) && /micromessenger|qq/i.test(ua)) {
    let iframe = document.createElement('iframe');
    // qq的webview中必须设置具体的src才生效
    iframe.setAttribute('src', /qq/i.test(ua) ? '/static/imgVar/favicon.ico' : 'about:blank');
    iframe.style.display = 'none';
    iframe.addEventListener('load', function () {
      setTimeout(function () {
        document.body.removeChild(iframe);
      }, 0);
    });
    document.body.appendChild(iframe);
  }
}

//设置cookie
function setCookie(cname, cvalue,exday) {
        var exdays=1;
        if(exday){
          exdays=exday;
        }
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue +";"+ expires;

}
//设置cookie
function setCookieDirectFrame(cname, cvalue,exday) {
        var d = new Date();
        d.setTime(d.getTime() +exday);
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue +";"+ expires;

}
//设置域名.facebank.cn下的cookie
function setCookieAll(cname, cvalue, exday) {
        var exdays=1;
        if(exday){
          exdays=exday;
        }
        var d = new Date();
        var cookieDomain='.facebank.cn';
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";domain=" +cookieDomain+ ";"+ expires;

}
//读取cookie
function getCookie(cname)
{
    var arr,reg=new RegExp("(^| )"+cname+"=([^;]*)(;|$)");
    if(arr=document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}
//获取平台属性
function getPlatform()
{
  //读取platform
   if(getCookie('curDevice') && getCookie('curDevice') != 'undefined'){
        if(getCookie('curDevice')=='ios'){
          return 'iOS';
        }else if(getCookie('curDevice')=='android'){
          return 'android';
        }else {
            return 'wap';
        }
    }else{
      if(isWeiXin()){
          return 'wechat';
      }else{
          return 'wap';
      }
    }
}
//获取渠道来源
function getChannel(){
    if(isWeiXin()){
        return 'wechat';
    }else{
        return 'wap';
    }
}
function getIslogin()
{
  //读取platform
  var isMicSessionid=getCookie("mic_sessionid");
  var isKey=getCookie("_key");
  if(isMicSessionid||isKey){
    return true;
  }else{
    return false;
  }
}

/*去首页*/
function toIndex(){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
         android.jsInterfaceToActNew("TabHostActivity","{\"toAppointTab\":\"toHomePage\"}");
       }
       else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
           appdo("home");
       }else{
                window.location.href="/home";
       }
}
/*去登录*/
function toLogin(cburl){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
            window.location.href="/regOrlogin"+(cburl ? ('?cburl='+cburl) : '');
         }else {
            android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true}");
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
            window.location.href="/regOrlogin"+(cburl ? ('?cburl='+cburl) : '');
         }else {
           appdo("loginAndRefresh");
         }
       }else{
                window.location.href="/regOrlogin"+(cburl ? ('?cburl='+cburl) : '');
       }

}
function resLogin(){
  var curDevice=getCookie('curDevice');
  var curVersion=getCookie('curVersion');
  var curVersionNumFit=0;
  var isShowAllWap=getCookie('isShowAllWap');
   if(curVersion){
      curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
   }

   if(curDevice=="android"&& curVersionNumFit>274){
     if(curVersionNumFit<=290&&isShowAllWap=='1'){
        window.location.href="/regOrlogin";
     }else {
        android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true}");
     }
   }
   else if (curDevice=="ios" && curVersionNumFit>274) {
     if(curVersionNumFit<=291&&isShowAllWap=='1'){
        window.location.href="/regOrlogin";
     }else {
        appdo("loginAndRefresh");
     }
   }else{
         window.location.href="/regOrlogin";
   }
   if(curDevice=="ios"&&isShowAllWap=='1'){
      window.location.href="/home";
   }
}
function resLoginHome(){
  var curDevice=getCookie('curDevice');
  var curVersion=getCookie('curVersion');
  var curVersionNumFit=0;
  var isShowAllWap=getCookie('isShowAllWap');
   if(curVersion){
      curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
   }

   if(curDevice=="android"&& curVersionNumFit>274){
     if(curVersionNumFit<=290&&isShowAllWap=='1'){
        window.location.href="/regOrlogin";
     }else {
        //android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true}");
        android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true,\"ifNeedCloseTheWebview\":true}");
     }
   }
   else if (curDevice=="ios" && curVersionNumFit>274) {
     if(curVersionNumFit<=291&&isShowAllWap=='1'){
        window.location.href="/regOrlogin";
     }else {
        appdo("loginAfterGoHome");
     }
   }else{
         window.location.href="/regOrlogin";
   }
   if(curDevice=="ios"&&isShowAllWap=='1'){
      window.location.href="/home";
   }
}
/*去登录带cburl,成功后在当前activity*/
function toLoginCburl(cburl){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
              window.location.href="/regOrlogin?cburl="+cburl;
         }else {
           android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true}");
           //android.jsInterfaceToActNew("Activity_Login","{\"ifNeedCloseTheWebview\":true,\"isNeedRequestAccount\":true}");
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
              window.location.href="/regOrlogin?cburl="+cburl;
         }else {
           appdo("loginAndRefresh");
         }
       }else{
                window.location.href="/regOrlogin?cburl="+cburl;
       }

}
/*去登录带cburl,中途关闭后去首页*/
function toLoginHomeCburl(cburl){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
              window.location.href="/regOrlogin?cburl="+cburl;
         }else {
           android.jsInterfaceToActNew("Activity_Login","{\"isNeedRequestAccount\":true}");
           //android.jsInterfaceToActNew("Activity_Login","{\"ifNeedCloseTheWebview\":true,\"isNeedRequestAccount\":true}");
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
              window.location.href="/regOrlogin?cburl="+cburl;
         }else {
           appdo("loginAfterGoHome");
         }
       }else{
                window.location.href="/regOrlogin?cburl="+cburl;
       }

}
/*退出登录*/
function loginOut(url){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
           if(url){
             window.location.href=url;
           }else{
             window.location.href="/home";
           }
         }else {
           android.logoutClearLoginInfo();
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
           if(url){
             window.location.href=url;
           }else{
             window.location.href="/home";
           }
         }else {
           logoutClearLoginInfo();

         }
       }
       if(url){
         window.location.href=url;
       }else{
         window.location.href="/home";
       }

}
/*更改手机号退出登录*/
function loginOutChangeMobile(url){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
           if(url){
             window.location.href=url;
           }else{
             window.location.href="/home";
           }
         }else {
           android.logoutClearLoginInfo();
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
           if(url){
             window.location.href=url;
           }else{
             window.location.href="/home";
           }
         }else {
           logoutClearLoginInfoForNative();

         }
       }
       if(url){
         window.location.href=url;
       }else{
         window.location.href="/home";
       }

}

/*去注册*/
function toRegister(){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274){
         if(curVersionNumFit<=290&&isShowAllWap=='1'){
           window.location.href="/register";
         }else {
           android.jsInterfaceToActNew("Activity_register","{\"isNeedRequestAccount\":true,\"ifNeedRefreshTheWebview\":true}");
         }
       }
       else if (curDevice=="ios" && curVersionNumFit>274) {
         if(curVersionNumFit<=291&&isShowAllWap=='1'){
           window.location.href="/register";
         }else {
           appdo("registerAndRefresh");
         }
       }else{
            window.location.href="/register";
       }

}
/*去我的账户*/
function toAccount(){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
         android.jsInterfaceToActNew("TabHostActivity","{\"toAppointTab\":\"toMyAccount\"}");
       }
       else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
                appdo("gotoMyAccount");
         }else{
                window.location.href="/account";
       }
}

/*去我的账户*/
function toAuthentication(cburl){
  var curDevice=getCookie('curDevice');
  var curVersion=getCookie('curVersion');
  var curVersionNumFit=0;
  var isShowAllWap=getCookie('isShowAllWap');
  if(curVersion){
    curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
  }
  if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
    android.jsInterfaceToActNew("Activity_IdCardVerified","");
  }
  else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
    Real_Name_Validation("");
  }else{
    window.location.href="/authentication?cburl="+cburl;
  }
}
/*去散标出借列表*/
function toLoanlist(type){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
         android.jsInterfaceToActNew("TabHostActivity","{\"toAppointTab\":\"toInvest\"}");
       }
       else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
         appdo("loanList");
       }else{
            window.location.href="/loanList";
            window.event.returnValue=false;
       }
}
/*去智能出借列表*/
function toAutoInvestMatchPage(){
      var curDevice=getCookie('curDevice');
      var curVersion=getCookie('curVersion');
      var curVersionNumFit=0;
      var isShowAllWap=getCookie('isShowAllWap');
      if(curVersion){
          curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
       }
       if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
         android.jsInterfaceToActNew("TabHostActivity","{\"toAppointTab\":\"toInvest\"}");
       }
       else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
         appdo("loanList");
         }else{
                window.location.href="/loanList";
       }
}
/*新起webview域名为m.facebank.cn时,url不显示域名*/
function newWebView(url){
        var curDevice=getCookie('curDevice');
        var curVersion=getCookie('curVersion');
        var curVersionNumFit=0;
        var isShowAllWap=getCookie('isShowAllWap');
        if(curVersion){
            curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
         }
        var webUrl=DOMAINNAME+url;
        if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
            var urls = "{'webUrl':'" + webUrl + "'}";
            android.jsInterfaceToActNew("Activity_webPage",urls);
        }else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
            pushNewVC({"className":"MPWebViewController","strPra":{"urlString":webUrl}});
        }else{
            window.location.href = url.replace(DOMAINNAME, '');
            //window.location.href = url;
        }
}
/*新起webview域名为m.facebank.cn时*/
function closeWebView(url){
        var curDevice=getCookie('curDevice');
        var curVersion=getCookie('curVersion');
        var curVersionNumFit=0;
        var isShowAllWap=getCookie('isShowAllWap');
        if(curVersion){
            curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
        }
        var webUrl=DOMAINNAME+url;
        if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
            android.finishPresentWebview()
        }else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
            appdo("closeCurren");
        }else{
            window.location.href = url.replace(DOMAINNAME, '');
        }
}


/*新起webview全域名，域名不是m.facebank.cn，url显示全域名*/
function newWebViewAll(url){
        var curDevice=getCookie('curDevice');
        var curVersion=getCookie('curVersion');
        var curVersionNumFit=0;
        var isShowAllWap=getCookie('isShowAllWap');
        if(curVersion){
            curVersionNumFit=parseInt(curVersion.replace(/\./g,""));
         }
        if(curDevice=="android"&& curVersionNumFit>274&&isShowAllWap=='0'){
            var urls = "{'webUrl':'" + url + "'}";
            android.jsInterfaceToActNew("Activity_webPage",urls);
        }else if (curDevice=="ios" && curVersionNumFit>274&&isShowAllWap=='0') {
            pushNewVC({"className":"MPWebViewController","strPra":{"urlString":url}});
        }else{
            window.location.href = url;
        }
}
function isLogin () {
  var logined = false;
  $.ajax({
    url : AJAXDOMAINNAME+ '/wap/user/loginJarge',
    async : false,
    success: function(res) {
      if (res.code == 1) {
        logined = true;
      }else{
        logined = false;
      }
    }
  });
  return logined;
}
/* 模仿android里面的Toast效果*/
  var Toast = function (config) {
      this.context = config.context == null ? $('body') : config.context; //上下文
      this.message = config.message; //显示内容
      this.time = config.time == null ? 2000 : config.time; //持续时间
      this.left = config.left; //距容器左边的距离
      this.top = config.top; //距容器上方的距离
      this.init();
  }
  var msgEntity;
  Toast.prototype = {
      //初始化显示的位置内容等
      init: function () {
          $("#toastMessage").remove();
          //设置消息体
          var msgDIV = new Array();
          msgDIV.push('<div id="toastMessage">');
          msgDIV.push('<span>' + this.message + '</span>');
          msgDIV.push('</div>');
          msgEntity = $(msgDIV.join('')).appendTo(this.context);
          //设置消息样式
          msgEntity.css({
              position: 'fixed',
              top: '40%',
              'z-index': '99',
              left:'50%',
              'background-color': 'rgba(51,51,51,0.8)',
              color: 'white',
              'font-size': '0.875rem',
              'padding': '1rem 0',
              'border-radius': '5px',
              'width':'14rem',
              'margin-left':'-7rem',
              'text-align' :'center',
          });
          msgEntity.hide();
      },
      //显示动画
      show: function () {
            msgEntity.fadeIn(this.time / 4);
          setTimeout(function(){
            msgEntity.fadeOut(this.time/4);
          },1000)
      }

  }
function toastFuc(msg){
  new Toast({context: $('body'), message: msg}).show();
}
export default {
    getUserInfo,
    getParames,
  borwer,
  toFixed,
  currency,
  isWeiXin,
  setDocumentTitle,
  dateDayFormata,
  dateSecondFormata,
  toIndex,
  toLogin,
  toLoginCburl,
  toRegister,
  toAccount,
  toLoanlist,
  toAutoInvestMatchPage,
  newWebView,
  newWebViewAll,
  closeWebView,
  setCookie,
  setCookieAll,
  setCookieDirectFrame,
  getCookie,
  getPlatform,
  getChannel,
  getIslogin,
  DOMAINNAME,
  URLSET,
  IsPC,
  AJAXDOMAINNAME,
  CMSSET,
  DAYSET,
  isLogin,
  activeType,
  formatThousandth,
  formatThousandthFixed,
  loginOut,
  loginOutChangeMobile,
  getSecretKey,
  resLogin,
  resLoginHome,
  executePrompt,
  checkPassword,
  toastFuc,
};
