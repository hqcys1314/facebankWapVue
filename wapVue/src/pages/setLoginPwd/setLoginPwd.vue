<template>
  <div id="setLoginPwd" v-cloak class="bgWhite">
      <div class="reg-send">
           <p class="p1">已发送验证码到您手机</p>
           <p class="p2">{{mobile}}</p>
       </div>
       <div class="rl-con">
           <div class="rl-con-list">
               <input type="tel"  name="verifyCode" placeholder="请输入验证码" class="rl-input"
                      v-model="verifyCode" v-on:keyup="changeBtnStatus()">
               <input name="msg-code" type="button" class="msg-code"  v-on:click="clickVerifyCode()" v-bind:disabled="verifyCodeBtnStatus"
                      v-bind:value="verifyCodeBtnText"
                      v-bind:class="{'cl-red': clA,'cl-grey': clB}" >
           </div>
           <div class="rl-con-list">
               <input type="password"  placeholder="请设置登录密码" class="rl-input" name="passwd"
                      v-model="password" v-on:keyup="changeBtnStatus()">
                <span class="rl-del"  v-on:click="delPassword()">
                    <img src="~assets/wapFront/register/img/del.png">
                </span>
           </div>
           <div class="rl-con-list">
               <input type="text"  placeholder="请输入图形验证码" class="rl-input" name="passwd"
                      v-model="imgCode" v-on:keyup="changeBtnStatus()">
                <span class="rl-img"><img :src="reloadImgSrc" v-on:click="reloadImgCode()"></span>
           </div>
           <div class="rl-tip">
               <img src="~assets/wapFront/register/img/tipi.png">密码8-20位，建议使用数字、字母、特殊符号(@#$%&)混合
           </div>
       </div>

       <div class="rl-btn">
           <input type="button" class="btn_tpls" value="设置密码" name="btnReg"
           v-bind:class="{'disabled': btnNextStatus}" v-bind:disabled="btnNextStatus"
           v-on:click="nextBtn()">
       </div>

   <div class="rl-kefu">
       <img src="~assets/wapFront/register/img/telIcon.png"><a href="tel:4008-900-766">4008-900-766</a>  (工作日：8:00-20:00)
   </div>
   <smileLoading  :showSmileLoading="isShowSmileLoading"></smileLoading>

  <wapTk2 v-bind:iswapTkShow2="wapTkStatus2" v-bind:pLeft2="pLeft2" v-on:close="wapTkClose()"></wapTk2>
  <!--统一提示层-->
  <informationLayer :content.sync="informationLayerContent" :show.sync="showLayerStatus"></informationLayer>
</div>
</template>
<style src="assets/wapFront/common/css/regOrlogin.css">
</style>
<script>
  import wapTk2 from '@/components/wapTk2'
  import {utils} from 'tools';
  import informationLayer from '@/components/informationLayer'
  export default {
    name: 'setLoginPwd',
    components:{wapTk2, informationLayer},//这里注册
    data(){
       return{
         mobile:'',
         password:'',
         verifyCode:'',
         imgCode : '',
         resetPWDToken : '',
         reloadImgSrc : '',

         informationLayerContent : '',
         showLayerStatus : false,

         pLeft2:'',
         wapTkStatus2:false,
         verifyCodeBtnText:'获取验证码',
         verifyCodeBtnStatus:true,
         btnNextStatus:true,//按钮是否disabled
         isA:false,//按钮是否变红
         clA:false,
         clB:true,
         smsCodeJsonUrl:'/wap/getLoginSmsCode',//获取验证码
         registerJsonUrl:'/wap/register',//注册接口
         miao:60,
         timeOut:'',
         isShowSmileLoading:false,
       }
    },
    created:function () {
       this.mobile = this.$route.query.mobile;
       this.verifyCodeBtnText="60秒";
       this.$options.methods.clickVerifyCode.bind(this)();
       this.reloadImgCode();
    },
    methods:{
        reloadImgCode:function(){
           this.resetPWDToken=new Date().getTime()+Math.round(Math.random()*10000);
           this.reloadImgSrc=this.utils.AJAXDOMAINNAME+ '/wap/getImageCode?imgToken='+this.resetPWDToken
        },
        //清空密码
        delPassword:function(){
           this.password="";
        },
        //弹框关闭
        wapTkClose:function(){
            this.wapTkStatus2=false;
        },
        showLayer(msg){
            this.informationLayerContent = msg
            this.showLayerStatus = true;
        },
        //点击按钮
         nextBtn:function(){
             // if(this.password.length < 8 || this.password.length > 20 || !this.utils.checkPassword(this.password)){
             //     this.showLayer('请输入由字母、数字、特殊符号(@#$%&)组成的8-20位密码');
             //     return;
             // }
             if(this.password == ''){
                 this.showLayer('请输入密码');
                 return;
             }
             if(this.verifyCode == ''){
                 this.showLayer('请输入短信验证码');
                 return;
             }

             if(this.imgCode == '' || this.imgCode.length != 4){
                 this.showLayer('请输入正确的图形验证码');
                 return;
             }
           var _this = this;
           this.isShowSmileLoading=true;
           $.ajax({
               url : utils.AJAXDOMAINNAME+"/wap/resetLoginPwd",
               data : '{"smsCode":"'+_this.verifyCode+'","newLoginPwd":"'+_this.utils.executePrompt(_this.password)+'","loginImgCode":"'+ _this.imgCode +'","imgToken":"'+ _this.resetPWDToken +'"}',
               success : function(res){
                   _this.isShowSmileLoading=false;
                   _this.reloadImgCode();
                   if(res.code==1){

                     var cu=_this.$route.query.cburl;
                     if(cu&&cu.indexOf("//")==-1) {//cburl中不存在‘//’时直接跳转cburl
                         window.location.href=_this.$route.query.cburl;
                     }else if(cu&&cu.indexOf("facebank.cn")>-1){//cburl中存在‘//’时，如果存在facebank直接跳转cburl
                         window.location.href=_this.$route.query.cburl;
                     }else{
                        _this.$router.push({path: '/account'});
                     }

                   }else {

                     _this.pLeft2=res.message;
                     _this.wapTkStatus2=true;
                   }
               },
               error:function(){
                 _this.isShowSmileLoading=false;
                 _this.reloadImgCode();

               }
           })
         },
         //键盘按下时判断按钮是否置灰
         changeBtnStatus:function(){

             if(this.verifyCode=="" ||this.password=="" ||this.verifyCode.length != 6 ||this.password.length<8 ||this.password.length>20){
                this.btnNextStatus=true;
                this.isA=false;
                 return false;
             }
            this.btnNextStatus=false;
            this.isA=true;
         },
         //获取验证码
         clickVerifyCode:function(){
           var _this = this;
           $.ajax({
               url : utils.AJAXDOMAINNAME+"/wap/resetPwdSMSCode",
               //data : '{"mobile":"'+_this.mobile+'"}',
               success : function(res){
                   if(res.code==1){
                     _this.miao = 60;
                     _this.$options.methods.timePass.bind(_this)();
                   }else {
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
             window.open('https://cms'+utils.CMSSET+'.facebank.cn/smile_contract_reg.html');
         }
     },
  }
  </script>
