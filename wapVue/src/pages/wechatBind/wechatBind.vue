<template>
  <div class="wechatBind">
    <div class="bd_1">
		    <img src="//static.facebank.cn/static/wapFront/common/img/logoWhite.png">
	</div>
  <div class="bd_2">
    <div class="div_pos">
        <p class="part1">
            <span class="icon"><img src="~assets/wapFront/common/img/icon1.png"></span>
            <input type="tel" v-model="telPhone"  name="telPhone" placeholder="请输入您的手机号码" maxlength="11"></p>
        <div class="part2">
            <span class="icon"><img src="~assets/wapFront/common/img/icon2.png"></span>
            <input type="tel" v-model="verifyCode"  name="verifycode" placeholder="请输入验证码" maxlength="6">

            <input type="button"   v-on:click="clickVerifyCode()" v-bind:disabled="verifyCodeBtnStatus"
                   v-bind:value="verifyCodeBtnText"  v-bind:class="{'cl-red': clA,'cl-grey': clB}"
              >
        </div>
        <p class="part4">
            温馨提示：未注册笑脸金融账号的手机号，登录时将自动注册笑脸金融账号，且代表您已同意《<a href="https://cms.facebank.cn/smile_contract_reg.html">笑脸金融用户协议</a>》
        </p>
        <p class="part3"><input class="btn_tpls" type="button" value="立即绑定" v-on:click="nextBtn()"></p>

      </div>
  </div>
  </div>
</template>

<style scoped src="./wechatBind.css"></style>

<script>
  import * as constants from './wechatBindConstants';

  export default {
    name: constants.NAME,
    data() {
      return {
        telPhone:'',
        verifyCode:'',
        verifyCodeBtnText:'获取验证码',
        verifyCodeBtnStatus:false,//验证码按钮是否disabled
        btnNextStatus:false,//按钮是否disabled
        isA:false,//按钮是否变红
        clA:true,
        clB:false,
        smsCodeJsonUrl:'/wap/getLoginSmsCode',//获取验证码
        registerJsonUrl:'/wap/wechat/bindWechatOpenId',//注册接口
        weChatOpenId:'',
      }
    },
    created:function () {
        this.weChatOpenId = this.$route.query.weChatOpenId;
    },
    methods: {
      //点击按钮
       nextBtn:function(){
           this.$http.post(utils.AJAXDOMAINNAME+ this.registerJsonUrl,{"smsCode":this.verifyCode,"mobile":this.telPhone,"wechatToken":this.weChatOpenId},{disableTips: true}).then(function(res){
                 if(res.data.code=="1"){
                    window.location.href = "//cms.facebank.cn/suc_20160901.html";
                 }else {
                   window.location.href = "//cms.facebank.cn/err_20161027.html";
                 }
            },function(res){
                console.warn(res);
            })
       },
      //获取验证码
      clickVerifyCode:function(){

        this.$http.post(utils.AJAXDOMAINNAME+ this.smsCodeJsonUrl,{"mobile":this.telPhone}).then(function(res){
          if(res.data.code=="1"){
            this.miao = 60;
            this.$options.methods.timePass.bind(this)();
          }
         },function(res){
             console.warn(res);
         });

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
    },
    components: {}
  }
</script>
