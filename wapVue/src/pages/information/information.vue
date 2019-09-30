<template>
    <div id="information" v-cloak>
      <div class="infoPart1">
         <div class="left" ref="face_box">
             <img ref="faceImage" v-if="isBindWx && weChatHeadPic && weChatHeadPic != 'null' && weChatHeadPic != 'undefined'" :src="decodeURI(weChatHeadPic)" alt="" />
             <img v-else src="https://static.facebank.cn/static/wapFront/depository/img/face.png?v=1"  alt="">
         </div>
         <div class="right">
             <p class="p2" v-if="userBaseInfoResult.hasIdValify == '0'">
                 {{userBaseInfoResult.mobile}}
             </p>
             <p class="p2" v-else>
                 <span>{{userBaseInfoResult.idNo}}</span>
                 {{userBaseInfoResult.userRealName}}
             </p>
         </div>
      </div>
      <div class="menu_item">
          <router-link class="item" :to="{ path: '/changeMobile'}">
              <p>
                  <span>登录手机号</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">{{userBaseInfoResult.mobile}}  修改</em>
              </p>
          </router-link>
          <router-link class="item" :to="{ path: '/setLoginPwd'}" v-if="userBaseInfoResult.userHasSetPassword== 0">
              <p>
                  <span>登录密码</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">设置</em>
              </p>
          </router-link>
          <router-link class="item" v-else :to="{ path: '/pwdManage'}">
              <p>
                  <span>登录密码</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">修改</em>
              </p>
          </router-link>
          <!-- <a class="item">
              <p>
                  <span>微信绑定</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1" v-show="!isBindWx" @click="bindWeChat()">去绑定</em>
                  <em class="font_1" v-show="isBindWx" @click="showUnbindWeChatLayer()">{{weChatNickName}}</em>
              </p>
          </a> -->
          <a class="item" v-if="isWeChat && !isBindWx" @click="bindWeChat()">
              <p>
                  <span>微信绑定</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">去绑定</em>
              </p>
          </a>
          <a class="item" v-if="isWeChat && isBindWx" @click="showUnbindWeChatLayer()">
              <p>
                  <span>微信绑定</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">{{(weChatNickName && weChatNickName != 'null' && weChatNickName != 'undefined') ? weChatNickName : '已绑定'}}</em>
              </p>
          </a>
      </div>
      <div class="menu_item">
          <a class="item" :class="{'noLine' : !isRiskShow}" href="javascript:;" @click="openSecuritiesClearing(100)" v-if="userBaseInfoResult.accountState=='100'">
              <p>
                  <span>银行存管账户</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">去开户</em>
              </p>
          </a>
          <a class="item" :class="{'noLine' : !isRiskShow}" @click="openSecuritiesClearing(userBaseInfoResult.accountState)" v-if="userBaseInfoResult.accountState=='150' || userBaseInfoResult.accountState=='160'">
              <p>
                  <span>银行存管账户</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1" v-if="userBankcardInfoResult.cardNo && userBankcardInfoResult.bankName">{{userBankcardInfoResult.bankName}}(尾号{{userBankcardInfoResult.cardNo&&userBankcardInfoResult.cardNo.substr(-4)}})  去激活</em>
                  <em class="font_1" v-else>{{userBankcardInfoResult.bankName}}去激活</em>
              </p>
          </a>
          <router-link class="item" :class="{'noLine' : !isRiskShow}" :to="{ path: '/depository'}" v-if="userBaseInfoResult.accountState=='200'">
              <p>
                  <span>银行存管账户</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">{{userBankcardInfoResult.bankName}}(尾号{{userBankcardInfoResult.cardNo&&userBankcardInfoResult.cardNo.substr(-4)}})</em>
              </p>
          </router-link>

          <a class="item" :href="'//promo'+utils.URLSET+'.facebank.cn/home/RiskEvaluation'" v-show="isRiskShow">
              <p>
                  <span>风险评测</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font" v-if="riskEvaluationInformation.riskNum*1>0">{{riskEvaluationInformation.riskRankName}}</em>
                  <em class="font" v-else>请测评<font class="import"></font></em>
              </p>
          </a>
      </div>

      <div class="menu_item">
          <a class="item" @click="contactUs()">
              <p>
                  <span>联系客服</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
                  <em class="font_1">查看</em>
              </p>
          </a>

          <a class="item" :href="'https://cms'+utils.CMSSET+'.facebank.cn/aboutUs.html'">
              <p>
                  <span>关于我们</span>
                  <i class="iconfont icon-ic_rightarrow"></i>
              </p>
          </a>
      </div>


      <div class="infoPart3" v-on:click="infoPart3Show()">
         退出登录
      </div>
      <div class="wapMc" v-show="wapMcTk"></div>
      <div class="waptanch" v-show="waptanchStatus">
          <a v-on:click="waplogout()" >
            <p class="p1">确认退出</p>
          </a>
          <p class="p2" v-on:click="closeTk()">取消</p>
      </div>

      <div class="wapPos" v-show="wapPosStatus">
          <div class="wapTip">
              <p class="p-left">进入微信公众号“笑脸平台”为您解答各种问题或拨打客服热线</p>
              <!-- <p class="p-phone"><a href="tel:01053957570">010-53957570</a></p> -->
              <p class="p-phone"><a href="tel:4008900766">4008-900-766</a></p>

              <!-- <p class="p-phone"><a href="tel:01056257720">010-56257720</a></p> -->
              <p class="p3" v-on:click="closeTk()">
                 我知道了
              </p>
          </div>
      </div>
        <appLoadTk v-bind:appLoadTkShow="appLoadTkShow"  v-on:close="wapTkClose()"></appLoadTk>
        <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2"  v-on:close="wapTkClose()"></wapTk2>
        <tosat ref="tosat"></tosat>
        <tipLayer ref="tipLayer"></tipLayer>
        <smileLoading  :showSmileLoading.sync="loadingLayerStatus"></smileLoading>
    </div>
</template>
<style scoped src="assets/wapFront/information/css/information.css"></style>
<style scoped lang="css">
.infoPart1 .left img{}
</style>
<script>
  import appLoadTk from 'components/appLoadTk/appLoadTk';
  import {Modal} from 'tools';
  import wapTk2 from 'components/wapTk2'
    export default {
      name: 'information',
      data () {
            return {
              userBaseInfoResult:"",
              userMobile : '',
              appLoadTkShow:false,
              wapMcTk:false,
              waptanchStatus:false,
              wapPosStatus:false,
              userBankcardInfoResult:'',
              wapTkStatus2:'',
              pLeft2:'',

              isRiskShow:false,
              riskEvaluationInformation : '',

              isWeChat: isWeiXin(), // 是否是微信浏览器
              isBindWx: false, // 是否绑定微信
              weChatNickName: '', // 微信昵称
              weChatHeadPic: '', // 微信头像

              loadingLayerStatus : false
            }
        },
        components:{appLoadTk,wapTk2},//这里注册
        created:function () {
            this.isWeChat = this.utils.borwer().weixin;
            this.weChatNickName = unescape(this.utils.getCookie('_WeChatNickName'));
            this.weChatHeadPic = this.utils.getCookie('_WeChatHeadImgLink');
            var _this = this;
            this.utils.setCookie('wechatOpenId', this.$route.query.weChatOpenId)
            this.utils.setCookieAll('wechatOpenId', this.$route.query.weChatOpenId)

            // setTimeout(function(){
            //     _this.initFace();
            // },200)

          //获取用户基本信息
          $.ajax({
              url : this.utils.AJAXDOMAINNAME+"/wap/getUserBaseInfo",
              success : function(res){
                  if(res.code==1){
                     _this.userBaseInfoResult=res.data;
                     if(res.data.wechatOpenid*1 == 1){ // 微信openid为空 => 未绑定微信
                        _this.isBindWx = true;
                     }
                  }
              }
          })
          //用户银行卡信息
          $.ajax({
              url : this.utils.AJAXDOMAINNAME+"/wap/getUserBindCard",
              success : function(res){
                  if(res.code==1){
                    _this.userBankcardInfoResult = res.data;
                  }
              }
          })

          //获取风险测评信息
          $.ajax({
              url : this.utils.AJAXDOMAINNAME+"/wap/user/riskEvaluationInformation",
              success : function(res){
                  if(res.code==1){
                     _this.riskEvaluationInformation=res.data;
                     if(_this.riskEvaluationInformation.riskEntranceIsOpen==1){
                        _this.isRiskShow=true;
                     }else{
                        _this.isRiskShow=false;
                     }
                  }
              }
          })
        },
        mounted:function(){
            this.isWeChat = this.utils.borwer().weixin;
        },
        methods: {
            /*initFace(){
                if(this.isBindWx && this.weChatHeadPic && this.weChatHeadPic != 'null' && this.weChatHeadPic != 'undefined'){
                    var _this = this;
                    var img = new Image(),w, h, nw, nh,b = _this.$refs.face_box.clientWidth;
                    var faces = _this.weChatHeadPic;
                    img.src=decodeURI(faces);
                    img.onload=function(){
                        w = this.width;
                        h = this.height;
                        if(w > h){
                            nh = b;
                            nw = (b/h)*w;
                            _this.$refs.faceImage.style.cssText="width:"+ nw +'px;height:'+  nh+'px;left:50%;margin-left:-'+ (nw/2) +'px;';
                        }else if(w < h){
                            nw = b;
                            nh = b/w*h;
                            _this.$refs.faceImage.style.cssText="width:"+ nw +'px;height:'+  nh+'px;top:50%;margin-top:-'+ (nh/2) +'px;';
                        }
                        _this.$refs.faceImage.src=decodeURI(faces)
                    }
                }
            },*/
            openSecuritiesClearing (status){
                var _this = this;
                if(this.userBaseInfoResult.hasIdValify == '0'){
                    this.$refs.tosat.tosatShow({
                        msg : '请先完成实名',
                        time : 2
                    }, function(){
                        _this.utils.newWebView('/authentication')
                    })
                    return false;
                };
                //at ： 用户激活状态
                if(status*1 == 160 || status*1 == 100){
                    //二要素
                    this.utils.newWebView('/depositoryOpen?at='+status)
                }else{
                    //四要素
                    this.utils.newWebView('/bindBankCard?at='+status)
                }
            },
            wapTkClose:function(){
                this.appLoadTkShow=false;
                this.wapTkStatus2=false;
                this.wapMcTk=false;
            },
            infoPart3Show:function(){
                this.wapMcTk=true;
                this.waptanchStatus=true;
            },
            waplogout:function(){
                 var _this = this;
                 $.ajax({
                     url : _this.utils.AJAXDOMAINNAME+"/wap/logout",
                     complete:function(XMLHttpRequest,textStatus){
                        _this.utils.setCookieAll('mic_sessionid', '',-1);
                        _this.utils.setCookieAll('_key', '',-1);
                        _this.utils.setCookieAll('certifi_key', '',-1);
                        _this.utils.setCookieAll('appQuickToken', '',-1);
                        _this.utils.setCookieAll('SESSION', '', -1);
                        _this.utils.setCookieAll('mic-ticket', '', -1);
                        _this.utils.setCookieAll('wechatOpenId','');
                        _this.utils.setCookie('wechatOpenId','');
                        _this.utils.setCookieAll('_WeChatNickName','',-1);
                        _this.utils.setCookie('_WeChatNickName','',-1);
                        _this.utils.setCookie('_WeChatHeadImgLink','',-1);
                        _this.utils.loginOut();

                      }
                 })
            },
            closeTk:function(){
                this.wapMcTk=false;
                this.wapPosStatus=false;
                this.waptanchStatus=false;
            },
            contactUs:function(){
                this.wapMcTk=true;
                this.wapPosStatus=true;
            },
            // 绑定微信事件
            bindWeChat() {
                var _this = this;
                var wechatOpenId = this.utils.getCookie('wechatOpenId');
                var url = "https://weixin"+ this.utils.URLSET +".facebank.cn/index.php/Home/WebGetOpndId?authType=2&cburl=https%3a%2f%2fm.facebank.cn%2finformation";
                var url2 = "https://weixin"+ this.utils.URLSET +".facebank.cn/index.php/Home/WebGetOpndId?authType=2&cburl=https%3a%2f%2fm.facebank.cn%2fwechatBindConfirm";
                if(wechatOpenId != null && wechatOpenId != undefined && wechatOpenId != ''){
                    _this.loadingLayerStatus = true;
                    $.ajax({
                        url: this.utils.AJAXDOMAINNAME+"/wap/wechatUserBind",
                        data: JSON.stringify({
                            wechatOpenId: this.utils.getCookie('wechatOpenId')
                        }),
                        error:function(XMLHttpRequest, textStatus){
                            _this.loadingLayerStatus = false;
                            if(textStatus == 'error'){
                                _this.utils.toastFuc('网络请求错误，请稍候重试');
                            }else if(textStatus == 'timeout'){
                                _this.utils.toastFuc('网络请求超时，请稍候重试');
                            }
                        },
                        success: (res) => {
                            _this.loadingLayerStatus = false;
                            if(res.code*1 == 1){
                                _this.isBindWx = true;
                                if(res.data && res.data.nickname){
                                    _this.utils.setCookie('_WeChatNickName',escape(res.data.nickname));
                                    _this.utils.setCookieAll('_WeChatNickName',escape(res.data.nickname));
                                    _this.utils.setCookie('_WeChatHeadImgLink',res.data.headimgurl);

                                    _this.weChatHeadPic = res.data.headimgurl;
                                    _this.weChatNickName = res.data.nickname;
                                    // setTimeout(function(){
                                    //     _this.initFace();
                                    // },200)
                                }

                            }else if(res.code*1 == -903){
                                _this.utils.setCookieAll('wechatOpenId', '', -1);
                                _this.utils.setCookie('wechatOpenId', '', -1);
                                _this.utils.setCookieAll('_WeChatNickName','',-1);
                                _this.utils.setCookie('_WeChatNickName','',-1);
                                _this.utils.setCookie('_WeChatHeadImgLink','',-1);
                                _this.weChatHeadPic = '';
                                _this.weChatNickName = '';
                                // _this.$refs.tosat.tosatShow({
                                //     msg : res.message,
                                //     time : 2
                                // }, function(){
                                //     window.location.href=url2;
                                //     window.event.returnValue=false;
                                // })
                                window.location.href=url2;
                                window.event.returnValue=false;
                                return;
                            }
                            _this.$refs.tosat.tosatShow({
                                msg : res.message,
                                time : 2
                            })
                        }
                    })
                }else{
                    window.location.href=url;
                    window.event.returnValue=false;
                }
            },
            showUnbindWeChatLayer(){
                var _this = this;
                _this.$refs.tipLayer.showByParame({
                    title : 'noTitle',
                    content : '<div style="font-size:1.125rem;color:#2B313D">确定解绑微信关系吗？</div>',
                    btnArr : [
                        {
                            text : '取消解绑',
                            style: 'color:#848999',
                            fn : function(layer){
                                _this.$refs.tipLayer.closeLayer();
                            }
                        },
                        {
                            text : '确定解绑',
                            fn : function(layer){
                                _this.unBindWeChat();
                            }
                        }
                    ]
                })
            },
            // 解除绑定微信事件
            unBindWeChat() {
                var _this = this;
                _this.$refs.tipLayer.closeLayer();
                _this.loadingLayerStatus = true;
                $.ajax({
                    url: this.utils.AJAXDOMAINNAME+"/wap/wechatUnbind",
                    error:function(XMLHttpRequest, textStatus){
                        _this.loadingLayerStatus = false;
                        if(textStatus == 'error'){
                            this.utils.toastFuc('网络请求错误，请稍候重试');
                        }else if(textStatus == 'timeout'){
                            this.utils.toastFuc('网络请求超时，请稍候重试');
                        }
                    },
                    success: (res) => {
                        _this.loadingLayerStatus = false;
                        if(res.code == 1){
                            this.isBindWx = false;
                            _this.utils.setCookieAll('_WeChatNickName','',-1);
                            _this.utils.setCookie('_WeChatNickName','',-1);
                            _this.utils.setCookie('_WeChatHeadImgLink','',-1);
                            _this.weChatHeadPic = '';
                            _this.weChatNickName = '';
                        }
                        this.$refs.tosat.tosatShow({
                            msg : res.message,
                            time : 2
                        })
                    }
                })
            },
        }
   }
  function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }
</script>
