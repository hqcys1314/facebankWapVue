<template>
  <div class="newWelfare newWelfareBg">
    <div class="fm-1">
        <img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/freshmanBanner.jpg" class="img_bg">
        <p @click="guizeShow()">规则></p>
    </div>


    <div class="fm-5">
        <div class="div_pos">
    	        <a v-show="!isBindCard"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/jiaxiNo.png"></a>
    	        <a v-show="isBindCard"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/jiaxiYes.png"></a>
    	        <a v-show="!isLogin"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/tyjNo.png"></a>
    	        <a v-show="!isLogin" style="margin: 0;"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/yuqiNo.png"></a>
    	        <a v-show="isLogin"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/tyjYes.png"></a>
    	        <a v-show="isLogin" style="margin: 0;"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/yuqiYes.png"></a>
        </div>
    	  <div class="div_tip" v-show="!isBindCard&&isLogin">
    	        <img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/jiaxiNoTip.png">
    	  </div>
    </div>
    	<div class="fm-2" v-show="!isLogin">
    	    <div class="div_pos">
    	        <p class="part1"><input name="telPhone" type="tel" v-model="telPhone" placeholder="输入手机号码领取红包"></p>
              <p class="part2"><input name="verifyCode" type="tel" v-model="verifyCode" placeholder="输入验证码"  >
                <input name="verifyCodeBtn" type="button" :value="verifyCodeBtnText" :disabled="verifyCodeBtnStatus"    v-bind:class="{'nw-red': clA,'nw-grey': clB}"
                            v-on:click="clickverifyCode()" /></p>

    	        <p class="part3"><input name="getWelfareBtn" type="button" value="立即领取福利"
                v-on:click="getWelfare()"></p>
    	        <p class="part6">
    	            <input name="agreeBox" type="checkbox" id="agreeBox" checked="checked">
    	            <span>我已阅读和同意
    	                <a :href="'https://cms'+utils.CMSSET+'.facebank.cn/smile_contract_reg.html'">《笑脸金融用户协议》</a>
    	            </span>
    	        </p>
    	    </div>
    	</div>
        <!--登录未实名-->
        <div class="fm-2" v-if="isLogin&&!isIdValify&&!isBindCard">
            <div class="div_pos">
                <p class="part3"><input name="toAuthentication" type="button" value="实名" v-on:click="toAuthentication()"></p>
            </div>
        </div>
        <!--登录未绑卡-->
        <div class="fm-2" v-else-if="isLogin&&!isBindCard">
            <div class="div_pos">
                <p class="part3"><input name="toBindBankCard" type="button" value="开通存管账户" v-on:click="toBindBankCard()"></p>
            </div>
        </div>
    <!--登录已绑卡-->
    	<div class="fm-2" v-else-if="isLogin&&isIdValify&&isBindCard">
    	    <div class="div_pos">
    	        <p class="tip-2"><img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/tip_2.png"></p>
    	         <p class="part3"><input name="toAutoInvestMatchPage" type="button" value="立即出借"
              v-on:click="utils.toAutoInvestMatchPage()"></p>
    	     </div>
    	</div>
    <div class="fm-3">
        <img src="//static.facebank.cn/static/wapFront/activity2017/freshman0524/img/freshmanBottom.gif">
    </div>
    <div class="fm-4">
        <p class="p1">活动最终解释权归深圳光华普惠所有</p>
        <p class="p2">理财有风险，出借需谨慎</p>
    </div>
    <div class="wapMc" v-show="wapMcTk">

    </div>
    <!--老用户注册提示,-->
    <div class="wapTk wapTkNw" v-show="oldUserStatus">
        <div class="tk_con">
            <p class="p_title">领取失败</p>
            <p class="p_con">该活动仅新用户哦，您可以邀请好友获得加息红包</p>
            <a class="p_btn" v-on:click="utils.toIndex()">确定</a>
            <div class="tiaozhuan">(<span>{{tzNum}}</span>)秒之后自动跳转</div>
            <p class="p_close">
                <img src="~assets/wapFront/common/img/close.png" class="tk_close"  v-on:click="wapTkClose()">
            </p>
        </div>
    </div>
    <!--规则弹框-->
    <div class="wapGz"  v-show="guize">
        <div class="gz_con">
            <p class="p_title">活动规则</p>
            <div class="content">
                <h2>体验金活动规则</h2>
                <p>体验金是笑脸金融为新注册用户提升产品体验而设计的虚拟出借本金。</p>
                <h3>领取方式：</h3>
                <p>活动开始后，注册成为笑脸金融用户即可获得15888元体验金。</p>
                <h3>收益计算：</h3>
                <p>本活动按年化收益10%，体验期限1天计算收益，当日领取，收益次日发放到您在笑脸金融账户，在完成首次出借后，体验金收益即可提现。</p>
                <h3>体验金回收：</h3>
                <p>在体验金收益发放后，体验金由系统进行自动回收。</p>
                <h3>收益回收：</h3>
                <p>收益发放后第30天，如果您未绑定银行卡或未进行真实出借操作，系统将回收收益。</p>
                <h2 style="border-top:1px #fcba86 solid; ">新手专享活动规则</h2>
                <h3>参与方式：</h3>
                <p>活动开始后，注册成为笑脸金融用户，即可获得共计999元的新手专享返现红包。</p>
                <h3>奖励说明：</h3>
                <p>注册后，在红包有效期内出借时，可以选择使用新手专享返现红包。出借成功后即返现到账。</p>
                <h3>限制条件：</h3>
                <p>新手专享返现红包需在有效期内使用。</p>

                <h2 style="border-top:1px #fcba86 solid; ">加息红包规则</h2>
                <h3>领取方式：</h3>
                <p>活动开始后，注册成为笑脸金融用户并完成开通存管账户即可获得1%加息红包。</p>
                <h3>有效期：</h3>
                <p>领取后30天内有效。</p>
                <h3>使用条件：</h3>
                <p>仅可以用于购买30天以上产品，新手标、体验金不可用。</p>
            </div>
            <p class="p_btn">上下滑动查看更多...</p>
            <p class="p_close">
                <img src="~assets/wapFront/common/img/close.png" class="tk_close"  v-on:click="wapTkClose()">
            </p>
        </div>
    </div>
    <!--分享蒙层-->
    <div class="wapShare">
        <img src="//static.facebank.cn/static/wapFront/common/img/shareContent1.png">
    </div>
    <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-on:close="wapTkClose()"></wapTk2>

  </div>
</template>

<style  src="./newWelfare.css"></style>

<script>
  import * as constants from './newWelfareConstants';
  import {utils,Modal} from 'tools';
  import wapTk2 from '@/components/wapTk2'

  export default {
    name: constants.NAME,
    data() {
      return {
          isLogin:false,
          isBindCard:false,
          isIdValify : false,
          wapMcTk:false,
          verifyCodeBtnText:'获取验证码',
          verifyCodeBtnStatus:false,//按钮是否disabled
          clA:true,
          clB:false,
          telPhone:'',
          verifyCode: '',
          miao:60,
          timeOut:'',
          guize:false,
          oldUserStatus:false,
          platform:'wap',
          pLeft2:'',
          wapTkStatus2:false,
          tzNum:'3',
          channel:'',
          origin:'wap',
          businessChannel:'',
      }
    },
    components:{wapTk2},//这里注册
    created:function () {
        var userInfo = utils.getUserInfo();
          this.isLogin=userInfo.isLogin;
          this.isBindCard=userInfo.isBindCard;
          this.isIdValify=userInfo.isIdValify;
          this.platform=utils.getPlatform();
          this.channel=utils.getChannel();
          if(this.$route.query.businessChannel){
            this.businessChannel=this.$route.query.businessChannel;
          }
    },
    methods: {
      toAuthentication:function(){
          this.$router.push({
              name : 'authentication',
              query : {
                  cburl : '/newWelfare'
              }
          })
      },
      toBindBankCard:function(){
          var _this = this;
          utils.activeType(function(re){
              _this.closeLayer();
              if(re == 'isTwo'){
                  utils.newWebView('/depositoryOpen')
              }else{
                  utils.newWebView('/bindBankCard')
              }
          })
          /*this.$router.push({
              name : 'bindBankCard',
              query : {
                  cburl : '/newWelfare'
              }
          })*/
      },
      //弹框关闭
       wapTkClose:function(){
         this.wapMcTk=false;
         this.guize=false;
         this.oldUserStatus=false;
         this.wapTkStatus2=false;
       },
       guizeShow:function(){
         this.wapMcTk=true;
         this.guize=true;
       },
       getWelfare:function(){
         var _this = this;
         $.ajax({
             url : utils.AJAXDOMAINNAME+"/wap/register",
             data : '{"smsCode":"'+_this.verifyCode+'","loginPwd":"","mobile":"'+_this.telPhone+'","platform":"'+_this.platform+'","channel":"'+_this.channel+
             '","origin":"'+_this.origin+'","businessChannel":"'+_this.businessChannel+'","wechatOpenId":'+ utils.getCookie('wechatOpenId') +'}',
             success : function(res){
                 if(res.code==1){
                    if(res.data && res.data.nickname){ // nickname 存在就保存 微信用户昵称和头像
                        _this.utils.setCookieAll('_WeChatNickName',escape(res.data.nickname));
                        _this.utils.setCookie('_WeChatNickName',escape(res.data.nickname));
                        _this.utils.setCookie('_WeChatHeadImgLink',res.data.headimgurl);
                    }
                     _this.$router.push({path: '/authentication'});
                 }else {
                   _this.pLeft2=res.message;
                   _this.wapTkStatus2=true;
                 }
             }
         })
       },
       //获取验证码
       clickverifyCode:function(){
         var _this = this;
         $.ajax({
             url : utils.AJAXDOMAINNAME+"/wap/sendRegisterSMS",
             data : '{"mobile":"'+_this.telPhone+'"}',
             success : function(res){
                 if(res.code==1){
                   _this.miao = 60;
                   _this.$options.methods.timePass.bind(_this)();
                 }else if(res.code='-850'){
                    _this.oldUserStatus=true;
                    _this.wapMcTk=true;
                    setInterval(function(){
                       _this.tzNum--;
                       if(_this.tzNum=='0'){
                         utils.toIndex();
                       }
                    },3000);
                 }else{
                   _this.pLeft2=res.message;
                   _this.wapTkStatus2=true;
                 }
             }
         })

       },
       //验证码倒计时
       timePass:function() {

         var _self = this;
         if ( _self.miao == 0) {
           _self.verifyCodeBtnText="获取验证码";
           _self.clA=true;
           _self.clB=false;
           _self.verifyCodeBtnStatus=false;
           _self.miao = 60;
         } else {
           _self.verifyCodeBtnText=_self.miao+"秒";
           _self.verifyCodeBtnStatus=true;
           _self.clA=false;
           _self.clB=true;
           _self.miao--;
           var timeOut = setTimeout(
             function () {
               _self.timePass()
             }, 1000)
         }
       },
       /*打开协议*/
       openAgree: function (){
         window.open("https://cms.facebank.cn/smile_contract_reg.html");
       }
    },
  }
</script>
