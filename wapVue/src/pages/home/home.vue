<template>
    <div class="home">
        <div class="page_content" ref="homePage" :style="'bottom:'+ containerBottom">
            <div class="header" ref="header">
                <div class="background"></div>
                <div class="logo"></div>
            </div>
            <div class="top_active">
                <div v-if="topBanner.backType == '1'">
                        <img :src="backLink" class="background"  @click="exportUrl(topBanner.exportUrl)">
                </div>
                <div :style="'height:'+ topBannerBackHeight +'px;'" v-else-if="topBanner.backType == '2'">
                    <a  @click="exportUrl(topBanner.exportUrl)" class="backJsonLink"></a>
                    <div class="backJson" ref="backJosnAnimationBox"></div>
                </div>
                <div v-if="topBanner.foreType == '1'">
                        <img :src="foreLink" class="front"  @click="exportUrl(topBanner.exportUrl)">
                </div>
                <div v-else-if="topBanner.foreType == '2'">
                    <a  @click="exportUrl(topBanner.exportUrl)" class="frontJsonLink"></a>
                    <div class="frontJson" ref="frontJosnAnimationBox"></div>
                </div>
            </div>

            <div class="notice">
                <ul class="" ref="noticeBar">
                    <li v-for="messageInfo in generalModelListResult">
                         <a class="msg-title"
                             v-if="messageInfo.display_type=='1'"
                             v-on:click="showMessageLayers(messageInfo.order)"
                         >{{messageInfo.title}}</a>

                         <a v-if="messageInfo.display_type=='2'" class="msg-title" v-on:click="utils.newWebViewAll(messageInfo.content)">{{messageInfo.title}}</a>
                         <a class="msg-title" v-if="messageInfo.display_type=='0'">{{messageInfo.title}}</a>
                    </li>
                </ul>
            </div>

            <div class="active_box">
                <ul>
                    <li v-for="item in recommend_list" v-if="item.type*1 == 0">
                        <a href="javascript:;" v-if="item.type*1 == 0" @click="openLink(item.link)"><img :src="item.url" /></a>
                    </li>
                    <li><a href="javascript:;" @click="sign()"><img src="https://static.facebank.cn/static/wapFront/home/images/home_sign.png" /></a></li>
                </ul>
            </div>

            <div class="banner_box">
                <banner :listImg="bannerJsonResult"></banner>
            </div>

            <div class="tools_box">
                <h2>真诚靠谱的平台</h2>
                <ul>
                    <li v-for="item in homeImg_list"><a href="javascript:;" @click="openLink(item.link)"><img :src="item.url" /></a></li>
                </ul>
            </div>

            <ul class="news_list" v-if="article_list.length > 0">
                <li v-for="item in article_list"><a href="javascript:;" @click="openLink(item.link)"><span>{{item.time}}</span>{{item.title | handlerTitle}}</a></li>
            </ul>


            <feedbackEntrance sourceType="login-success" type="1"></feedbackEntrance>


            <div class="appLoadBottom" v-if="utils.getCookie('curDevice')!='ios'&&utils.getCookie('curDevice')!='android'">
              <p class="p1">安全可靠有底线</p>
              <a class="p2" href="//a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile">下载APP</a>
            </div>
            <div class="home_footer" v-else>安全可靠有底线</div>
            <!-- 未登录 -->
            <directFrame :isDirectFrame="isDirectFrameV1" :directContent="directContentV1" v-on:close="wapTkClose()" v-if="directContentV1&&directContentV1!=''&&directContentV1!=null"></directFrame>
            <!-- 已登录 -->
            <directFrame :isDirectFrame="isDirectFrameV2" :directContent="directContentV2" v-on:close="wapTkClose()" v-if="directContentV2&&directContentV2!=''&&directContentV2!=null"></directFrame>


        </div>

       <navBottom v-bind:isOn1="true"></navBottom>
       <tipLayer ref="tipLayer"></tipLayer>
       <toastMessage :istoastMessageShow="isTmShow" :toastTime="tTime" :message="tMsg"></toastMessage>
    </div>
</template>
<style scoped src="./home_new.css">
</style>
<script>
  import {Modal} from 'tools';
  import navBottom from '@/components/navBottom'
  import directFrame from '@/components/directFrame'
  import * as constants from './homeConstants';
  import banner from '@/components/banner.vue' //导入Banner组件
  import toastMessage from '@/components/toastMessage.vue' //导入首页引导图标
  export default {
    name: 'home',
    data(){
      return{
         isappLoadShow:false,
         language : (navigator.browserLanguage || navigator.language).toLowerCase(),
         generalModelListResult:'',
         bannerJsonResult:'',
         goodsList : '',
         ismessageInfoShow:false,
         newUserProduct:'',
         product:'',
         wapMcTk:false,
         weChatOpenId:'',
         showThisMessageLayer : false,
         currentNoticeContent : '',
         wapMcShow : false,
         isLogin:false,
         isInvested:false,
         isBindCard:false,
         userInfo:'',
         userBase:'',
         isDirectFrameV1:true,
         isDirectFrameV2:true,
         directContentV1:'',
         directContentV2:'',

         userStatusCode : '',
         topBanner : '',
         topBannerBackHeight : '',
         recommend_list : '',
         article_list : '',
         homeImg_list : '',

         curDevice : '',
         curVersion : '',
         containerBottom : '',

         isTmShow:false,//是否展示吐司
         tTime:2000,//吐司时间
         tMsg:'',

         backLink : 'https://facebank-static.oss-cn-hangzhou.aliyuncs.com/facebank/mic/test/1541138229773type1_banner_fr.png',
         foreLink : 'https://facebank-static.oss-cn-hangzhou.aliyuncs.com/facebank/mic/test/1541138229773type1_banner_fr.png',

      }
    } ,
    filters:{
        handlerTitle (val){
              var r=/[^\x00-\xff]/g;
              if(val.replace(r,"mm").length<=30){return val;}
              var m=Math.floor(30/2);
              for(var i=m;i<val.length;i++){
                  if(val.substr(0,i).replace(r,"mm").length>=30){
                      return val.substr(0,i)+"...";
                  }
              }
        }
    },
    components:{navBottom,banner,directFrame, toastMessage},//这里注册
    created:function () {
        var _this = this;
        setTimeout(()=>{
            _this.userBase=_this.utils.getUserInfo();
            _this.userInfo=_this.userBase.info;
            _this.isLogin=_this.userBase.isLogin;
            _this.isBindCard=_this.userInfo.userBindCardState == 1 ? true : false;
            _this.isInvested= _this.userInfo.hasInvest;
            _this.containerBottomFn();

            $.ajax({
                url : _this.utils.AJAXDOMAINNAME + '/wap/getUserStatus',
                async : false,
                success : function(rs){
                    if(rs.code*1 == 1){
                        _this.userStatusCode = rs.data.code;
                    }
                }
            })
            $.ajax({
                url : 'https://cic.facebank.cn/api/getBannerByCode',
                async : false,
                data : JSON.stringify({
                    code : _this.userStatusCode*1,
                    target : 1,
                }),
                success : function(rs){
                    if(rs.statusCode*1 == 200){
                        _this.topBanner = rs.banner;
                        _this.backLink = rs.banner.backLink;
                        _this.foreLink = rs.banner.foreLink;
                        if(rs.banner.backType*1 == 2){
                            _this.topBannerBackHeight = (window.innerWidth / 750) * (rs.banner.backHeight*1);
                            setTimeout(()=>{
                                lottie.loadAnimation({
                                    container: _this.$refs.backJosnAnimationBox, // the dom element that will contain the animation
                                    renderer: 'svg',
                                    loop: true,
                                    autoplay: true,
                                    path: rs.banner.backLink // the path to the animation json
                                });
                            }, 30)
                            _this.backLink = rs.banner.backLink;
                        }
                        if(rs.banner.foreType*1 == 2){
                            setTimeout(()=>{
                                lottie.loadAnimation({
                                    container: _this.$refs.frontJosnAnimationBox, // the dom element that will contain the animation
                                    renderer: 'svg',
                                    loop: true,
                                    autoplay: true,
                                    path: rs.banner.foreLink // the path to the animation json
                                });
                            }, 30)
                            _this.foreLink = rs.banner.foreLink;
                        }
                    }
                }
            })
            $.ajax({
                url : 'https://cic.facebank.cn/api/getAppConfigByKey',
                data : JSON.stringify({
                    configKey : 'index_recommend_item'
                }),
                success : function(rs){
                    if(rs.statusCode*1 == 200){
                        _this.recommend_list = rs.generalModelList;
                    }
                }
            })
            $.ajax({
                url : 'https://cic.facebank.cn/api/getAppConfigByKey',
                data : JSON.stringify({
                    configKey : 'index_article_item'
                }),
                success : function(rs){
                    if(rs.statusCode*1 == 200){
                        _this.article_list = rs.generalModelList;
                    }
                }
            })
            $.ajax({
                url : 'https://cic.facebank.cn/api/getAppConfigByKey',
                data : JSON.stringify({
                    configKey : 'index_img_item'
                }),
                success : function(rs){
                    if(rs.statusCode*1 == 200){
                        _this.homeImg_list = rs.generalModelList;
                    }
                }
            })



            //直达框失效时间
            var stimeV=new Date();
            var stime=Date.parse(stimeV);
            var etimeV=stimeV.getFullYear()+"-" + (stimeV.getMonth()+1) + "-" + (stimeV.getDate()+1);
            var etime=Date.parse(etimeV);
            //Cookie过期时间不是以本地时间而是服务器时间
            var loseDate=etime-stime-1;
            //未登录时是否展示直达框
            if(!_this.isLogin){
              _this.isDirectFrameV2=false;
              if((_this.utils.getCookie('curDevice')=='ios'||_this.utils.getCookie('curDevice')=='android')
                  &&_this.utils.getCookie('isShowAllWap')=='0'){
                _this.isDirectFrameV1=false;
              }else if(_this.utils.getCookie('isDirectFrameV1')=='1'){
                _this.isDirectFrameV1=false;
              }else{
                _this.isDirectFrameV1=true;
                if(_this.isDirectFrameV1&&(!_this.utils.getCookie('isDirectFrameV1')||_this.utils.getCookie('isDirectFrameV1')==null)){
                    _this.utils.setCookieDirectFrame('isDirectFrameV1', '1',loseDate);
                }
              }
            }else{//已登录直达框是否展示
              _this.isDirectFrameV1=false;
              //登录时是否展示直达框
              if((_this.utils.getCookie('curDevice')=='ios'||_this.utils.getCookie('curDevice')=='android')
                  &&_this.utils.getCookie('isShowAllWap')=='0'){
                _this.isDirectFrameV2=false;
              }else if(_this.utils.getCookie('isDirectFrameV2'+_this.userInfo.userId)=='1'){
                _this.isDirectFrameV2=false;
              }else{
                _this.isDirectFrameV2=true;
                if(_this.isDirectFrameV2&&(!_this.utils.getCookie('isDirectFrameV2'+_this.userInfo.userId)||_this.utils.getCookie('isDirectFrameV2'+_this.userInfo.userId)==null)){
                    _this.utils.setCookieDirectFrame('isDirectFrameV2'+_this.userInfo.userId, '1',loseDate);
                }
              }
            }


            //获取直达窗消息
            $.ajax({
                url : "https://cic.facebank.cn/api/getAppConfigByKey",
                data : '{"configKey":"wap_advertwindow"}',
                success : function(res){
                  if(res.statusCode==200&&res.generalModelList.length*1>0){
                      //已登录
                      var generalModelList2=res.generalModelList.filter(item => {
                          return item.is_loginuser == 1;
                      })
                      _this.directContentV2=generalModelList2[0];
                     //未登录
                      var generalModelList1=res.generalModelList.filter(item => {
                          return item.is_loginuser == 0;
                        })
                      _this.directContentV1=generalModelList1[0];
                    }
                }
            })
            //获取首页消息
            $.ajax({
                url : "https://cic.facebank.cn/api/getAppConfigByKey",
                data : '{"configKey":"mobile_homePageNotify"}',
                success : function(res){
                  if(res.statusCode==200){
                       _this.generalModelListResult=res.generalModelList;
                       let self = _this;
                       setTimeout(function(){self.noticeScrool()},1000)
                  }
                }
            })

          //获取banner的值
          $.ajax({
              url : "https://cic.facebank.cn/api/getAppConfigByKey",
              data : '{"configKey":"mobile_new_banner_wap"}',
              success : function(res){
                if(res.statusCode==200){
                      _this.bannerJsonResult=res.generalModelList.sort(function(a,b){
               					return a.weight-b.weight;
               				});
                }
              }
          })
      },50)
   },
    mounted : function(){

        /*this.$refs.tipLayer.showLayer({
            content : '这里是提示啊',
            btnText : '知道了',
            btn : [
                {
                    text : '取消',
                    style : 'color:#848999'
                },
                {
                    text : '确定'
                }
            ]
        })*/
        /*var headerBack = this.$refs.header.getElementsByClassName('background')[0],
            headerHeight = headerBack.clientHeight,
            defaultHeight = 2.75 * (window.innerWidth / 750),
            header = this.$refs.header,
            opacity = 0,height = 0;
        this.$refs.homePage.addEventListener('scroll', function(){
            opacity = this.scrollTop / headerHeight;
            height = headerHeight - this.scrollTop <= defaultHeight ? defaultHeight : headerHeight - this.scrollTop;
            headerBack.style.cssText="opacity:"+opacity;
            header.style.cssText="height:"+ height +"px";

        }, false)*/
    },
    methods:{
        sign(){
            //签到
            var _this=this;
            if(this.userBase.isLogin){
                $.ajax({
                    url : this.utils.AJAXDOMAINNAME+"/wap/user/signIn",
                    success : function(res){
                        if(res.code==1){
                            if(res.data.status == '200'){
                                _this.tMsg = '本次签到获得<span>'+ res.data.points +'</span>个笑脸币<br/>已连续签到<span>'+ res.data.count +'</span>天(7天/周期)'
                            }else if(res.data.status == '2001'){
                                _this.tMsg = '已签到'
                            }else{
                                _this.tMsg = '签到失败'
                            }
                            _this.isTmShow=true;
                            var self=_this;
                            setTimeout(function () {
                                _this.isTmShow=false;
                            //utils.newWebViewAll('https://promo'+utils.URLSET+'.facebank.cn/SnatchRedEnvelope/index');
                            }, 2000);
                        }
                    }
                })
            }else{
                this.utils.toLogin('/home');
            }
        },
        containerBottomFn(){
            this.curDevice=this.utils.getCookie('curDevice');
            this.curVersion=this.utils.getCookie('curVersion');
            if(this.curVersion) this.curVersion = parseInt(this.curVersion.replace(/\./g,""));
            if(this.curDevice == 'ios' && this.curVersion > 274&&this.utils.getCookie('isShowAllWap')=='0'){
                switch(window.innerHeight){
                    case 665 : {
                        this.containerBottom = (49/32) + 'rem';
                        break;
                    }
                    case 603 : {
                        this.containerBottom = (98/32) + 'rem';
                        break;
                    }
                    case 672 : {
                        this.containerBottom = (86/32) + 'rem';
                        break;
                    }
                    case 504 : {
                        if(window.innerWidth == 320){
                            this.containerBottom = (106/32) + 'rem';
                        }
                        break;
                    }
                    default : {
                        this.containerBottom = '0rem';
                    }
                }
            }else if(this.curDevice == 'android' && this.curVersion > 274 && this.utils.getCookie('isShowAllWap')=='0'){

                this.containerBottom = '0rem';
            }
        },
        exportUrl(url){
            var _this = this;

            setTimeout(()=>{
                if(url.indexOf("register") >= 0){
                    _this.utils.toRegister();
                } else if (url.indexOf("regOrlogin") >= 0) {
                    _this.utils.toLogin();
                } else {
                    window.location.href=url;
                }
            },300)

        },
        openLink : function(linkUrl){
            this.utils.newWebViewAll(linkUrl)
        },
        //首页公告轮播
        noticeScrool:function(){
            let transitionEnd=(function(){
                let transEndEventNames = {
                    WebkitTransition : 'webkitTransitionEnd',
                    MozTransition    : 'transitionend',
                    OTransition      : 'oTransitionEnd otransitionend',
                    transition       : 'transitionend'
                }
                for(var name in transEndEventNames){
                    if(typeof document.body.style[name] === "string"){
                    return transEndEventNames[name]
                    }
                }
            })();
            let box = this.$refs.noticeBar,
                child = box.children,
                moveHeight = child[0].clientHeight;
            if(child.length > 1){
                let noticeScrollTimer = setInterval(function(){
                    box.style["webkitTransitionDuration"] = '.5s';
                    box.style["transitionDuration"] = '.5s';

                    let first = box.children[0];
                    box.style.marginTop = -moveHeight + 'px';
                    box.addEventListener(transitionEnd, function(){
                        box.style["webkitTransitionDuration"] = '0s';
                        box.style["transitionDuration"] = '0s';
                        box.style.marginTop = '0px';
                        box.appendChild(first);
                    }, false)
                    //box.remove(first)
                },3000)
            }
        },
       //下载客户端立即下载按钮
        appLoad:function(){
          if (this.utils.isWeiXin()) {
              window.location = "//a.app.qq.com/o/simple.jsp?pkgname=com.ghph.smile";
          } else {
              if (this.$options.methods.versions.ios || this.$options.methods.versions.iPhone|| this.$options.methods.versions.iPad) {
                  window.location = "//itunes.apple.com/cn/app/xiao-lian-jin-rong-li-cai/id1038803512?mt=8";
              } else if (this.$options.methods.versions.android) {
                  window.location = "//static.facebank.cn/fb/FaceSmile-PRO-release_130_jiagu_sign/FaceSmile-PRO-release_130_jiagu_sign.apk";
              } else {
                  alert("当前浏览器非Android或IOS");
              }
          }
        },
        //关闭客户端下载弹框
        appLoadClose:function(){
          this.isappLoadShow=false;
        },
        showMessageLayers : function(order){
            let message = this.generalModelListResult.filter(item => {
                return item.order == order;
            })
            if(message.length > 0){
                this.$refs.tipLayer.showByParame({
                    title : 'noTitle',
                    content : message[0].content,
                    btnText : '知道了'
                })
            }
        },

        //弹框关闭
        wapTkClose:function(){
            this.isDirectFrameV1=false;
            this.isDirectFrameV2=false;
        },
        versions : function() {
          var u = navigator.userAgent, app = navigator.appVersion;
          return {//移动终端浏览器版本信息
            trident : u.indexOf('Trident') > -1, //IE内核
            presto : u.indexOf('Presto') > -1, //opera内核
            webKit : u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile : !!u.match(/AppleWebKit.*Mobile.*/)
                || !!u.match(/AppleWebKit/), //是否为移动终端
            ios : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android : u.indexOf('Android') > -1
                || u.indexOf('Linux') > -1, //android终端或者uc浏览器
            iPhone : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
            iPad : u.indexOf('iPad') > -1, //是否iPad
            webApp : u.indexOf('Safari') == -1
          //是否web应该程序，没有头部与底部
          };
        },
    }
  }

</script>
